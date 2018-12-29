import {Schema, Types} from 'mongoose';

import {UnionTaskFlow} from '../models/';

import {ITaskReportBaseItem, IUnionTaskFlowDetailModel, IUnionTaskFlowModel, IUnionTaskFlowModifyModel, IUnionTaskFlowSearchModel, IUnionTaskModel} from '../interfaces/model';
import {SystemCode} from '../types/common';
import {SocketMessageType} from '../types/socket';
import {TaskFlowStatus, TaskReportStatus, TaskReportType} from '../types/task';

import {buildAndRunUnionBotphusTask, sendUnionTaskFlowData} from '../modules/union_task_flow';
import {queryConnectionById} from './connection';
import {queryTaskListByIds, queryTaskMapByIds} from './task';
import {createTaskReports, pendTaskReportByFlowId, queryTaskReportMap} from './task_report';
import {queryUnionTaskById, queryUnionTaskMapByIds, verifyUnionTaskOwner} from './union_task';

import {app, createSystemError, getUnduplicatedFieldInList, localePkg} from '../modules/util';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id name status unionTaskId createdAt updateAt';

/**
 * Get task ID list from union task detail
 * @param  {IUnionTaskModel}     unionTaskDetail Union task detail
 * @param  {IUnionTaskFlowModel} unionTaskFlow   Union task flow detail
 * @return {string[]}                            Task ID list
 */
function getTaskIds(unionTaskDetail: IUnionTaskModel, unionTaskFlow: IUnionTaskFlowModel): Schema.Types.ObjectId[] {
    let taskItems = unionTaskDetail.taskItems || [];
    if (unionTaskFlow.excludeTask) {
        taskItems = taskItems
            .filter((item) => {
                return !unionTaskFlow.excludeTask[item.taskId.toString()];
            });
    }
    return taskItems.map((item) => {
        return item.taskId;
    });
}

/**
 * Query union task flow info by ID
 * @param  {Schema.Types.ObjectId}        unionTaskFlowId Union task flow ID
 * @param  {string}                       fields          Field list
 * @return {Promise<IUnionTaskFlowModel>}                 Promise with uion task flow Info
 */
export function queryUnionTaskFlowById(unionTaskFlowId: Schema.Types.ObjectId, fields: string = null): Promise<IUnionTaskFlowModel> {
    return UnionTaskFlow.findById(unionTaskFlowId, fields).exec();
}

/**
 * Query task flow list
 * @param  {IUserSearchModel}                         query    Query condition
 * @param  {number}                                   page     Page
 * @param  {number}                                   pageSize Page size
 * @param  {string}                                   fields   Field list
 * @return {Promise<[number, IUnionTaskFlowModel[]]>}          Promise with total number & task flow info list
 */
export function queryUnionTaskFlowList(query: IUnionTaskFlowSearchModel, page: number, pageSize: number, fields: string = defaultFields): Promise<[number, IUnionTaskFlowModel[]]> {
    const condition: any = {};
    if (query.name) {
        condition.name = {
            $regex: query.name
        };
    }
    if (query.createdUser) {
        condition.createdUser = query.createdUser;
    }
    if (typeof query.status === 'number') {
        condition.status = query.status;
    }
    return Promise.all([
        UnionTaskFlow.countDocuments(condition).exec(),
        UnionTaskFlow.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ])
        .then((data) => {
            const ids = getUnduplicatedFieldInList<IUnionTaskFlowModel, 'unionTaskId'>(data[1], 'unionTaskId');
            return queryUnionTaskMapByIds(ids, '_id name')
                .then((map) => {
                    data[1] = data[1].map((item) => {
                        const curTask = map[item.unionTaskId.toString()];
                        let unionTaskName: string = '';
                        if (curTask) {
                            unionTaskName = curTask.name;
                        }
                        return Object.assign(item.toObject(), {
                            unionTaskName
                        });
                    });
                    return data;
                });
        });
}

/**
 * Query union task flow detail by user
 * @param  {Schema.Types.ObjectId}              unionTaskFlowId Task flow ID
 * @return {Promise<IUnionTaskFlowDetailModel>}                 Promise with Task flow Info
 */
export function queryUnionTaskFlowByUser(unionTaskFlowId: Schema.Types.ObjectId): Promise<IUnionTaskFlowDetailModel> {
    return queryUnionTaskFlowById(unionTaskFlowId)
        .then((unionTaskFlow) => {
            return Promise.all([
                Promise.resolve(unionTaskFlow),
                queryUnionTaskById(unionTaskFlow.unionTaskId, 'name taskItems updateAt'), // union task info
                queryTaskReportMap(unionTaskFlow._id), // Task report map
                unionTaskFlow.mysqlId ? queryConnectionById(unionTaskFlow.mysqlId, 'name config') : Promise.resolve(null), // Mysql
                unionTaskFlow.redisId ? queryConnectionById(unionTaskFlow.redisId, 'name config') : Promise.resolve(null) // Redis
            ]);
        })
        .then(([unionTaskFlow, unionTaskDetail, taskReportMap, mysqlDetail, redisDetail]) => {
            const unionTaskFlowDetail: IUnionTaskFlowDetailModel = Object.assign(unionTaskFlow.toObject(), {
                taskReportMap,
                unionTaskDetail,
            });
            if (mysqlDetail) {
                unionTaskFlowDetail.mysqlDetail = mysqlDetail;
            }
            if (redisDetail) {
                unionTaskFlowDetail.redisDetail = redisDetail;
            }
            return Promise.all([
                Promise.resolve(unionTaskFlowDetail),
                queryTaskMapByIds(getTaskIds(unionTaskDetail, unionTaskFlow), '_id name pageType ruleItems')
            ]);
        })
        .then(([unionTaskFlowDetail, taskDetailMap]) => {
            unionTaskFlowDetail.taskDetailMap = taskDetailMap;
            return unionTaskFlowDetail;
        });
}

/**
 * Create union task flow
 * @param  {IUnionTaskFlowModel}          unionTaskFlowData Union task flow data
 * @param  {string}                       createUser        Create user ID
 * @return {Promise<IUnionTaskFlowModel>}                   Promise with union task flow Info
 */
export function createUnionTaskFlow(unionTaskFlowData: IUnionTaskFlowModel, createUser: string): Promise<IUnionTaskFlowModel> {
    const unionTaskFlow = Object.assign(new UnionTaskFlow(), unionTaskFlowData, {
        status: TaskFlowStatus.PENDING
    });
    unionTaskFlow.createdUser = Types.ObjectId(createUser);
    return verifyUnionTaskOwner(unionTaskFlow.unionTaskId, createUser)
        .then(() => {
            return unionTaskFlow.save();
        })
        .then((flowData) => {
            return queryUnionTaskById(flowData.unionTaskId, 'taskItems') // Query union task flow data
                .then((unionTaskDetail) => {
                    return queryTaskListByIds(getTaskIds(unionTaskDetail, flowData), 'ruleItems'); // Get task list info
                })
                .then((taskList) => {
                    let data: ITaskReportBaseItem[] = [];
                    taskList.forEach((taskData) => {
                        const taskReportList = taskData.ruleItems.map((taskRule) => {
                            return {
                                flowId: flowData.id,
                                index: `${taskData._id}-${taskRule.id}`,
                                message: '',
                                receiveData: '',
                                status: TaskReportStatus.PENDING,
                                type: TaskReportType.UNION_TASK,
                            };
                        });
                        data = data.concat(taskReportList);
                    });
                    return createTaskReports(data);
                })
                .then(() => {
                    return flowData;
                });
        });
}

/**
 * modify union task flow by ID
 * @param  {Schema.Types.ObjectId}     unionTaskFlowId   Union task flow ID
 * @param  {IUnionTaskFlowModifyModel} unionTaskFlowData Union task flow update data
 * @return {Promise<any>}                                Promise with task flow id
 */
export function modifyUnionTaskFlowById(unionTaskFlowId: Schema.Types.ObjectId, unionTaskFlowData: IUnionTaskFlowModifyModel): Promise<any> {
    return UnionTaskFlow.updateOne({
        _id: unionTaskFlowId
    }, unionTaskFlowData).exec();
}

/**
 * Start union task flow
 * @param  {Schema.Types.ObjectId} unionTaskFlowId Union task flow ID
 * @param  {string}                userId          User ID
 * @return {Promise<void>}                         Promise
 */
export function startUnionTaskFlow(unionTaskFlowId: Schema.Types.ObjectId, userId: string): Promise<void> {
    return queryUnionTaskFlowByUser(unionTaskFlowId)
        .then((flowData) => {
            // Check flow create date is before task update time
            if (new Date(flowData.createdAt) < new Date(flowData.unionTaskDetail.updateAt)) {
                modifyUnionTaskFlowById(unionTaskFlowId, {
                    status: TaskFlowStatus.CLOSE
                });
                throw createSystemError(localePkg.Service.TaskFlow.startForbidden, SystemCode.FORBIDDEN);
            }
            return pendTaskReportByFlowId(unionTaskFlowId)
                .then(() => {
                    modifyUnionTaskFlowById(flowData._id, {
                        status: TaskFlowStatus.ONGOING
                    });
                    return buildAndRunUnionBotphusTask(flowData);
                })
                .then((event) => {
                    event.on('exit', (code) => {
                        const status = code === 0 || !code ? TaskFlowStatus.SUCCESS : TaskFlowStatus.FAILED;
                        modifyUnionTaskFlowById(flowData._id, {
                            status
                        });
                        sendUnionTaskFlowData(flowData.taskReportMap[Object.keys(flowData.taskReportMap)[0]], {
                            message: `${status}`
                        }, userId, SocketMessageType.TASK_END);
                        app.log.debug('Event close code:', code);
                    });
                });
        });
}

/**
 * Modify union task flows
 * @param  {any}                    query      Update query condition
 * @param  {ITaskReportModifyModel} updateData Update data
 * @return {Promise<any>}                      Promise
 */
export function modifyUnionTaskFlows(query: any, updateData: IUnionTaskFlowModifyModel): Promise<any> {
    return UnionTaskFlow.updateMany(query, updateData)
        .exec();
}
