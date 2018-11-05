import {Schema, Types} from 'mongoose';

import {TaskFlow} from '../models/';

import {ITaskFlowDetailModel, ITaskFlowModel, ITaskFlowModifyModel, ITaskFlowSearchModel, ITaskReportBaseItem} from '../interfaces/model';
import {SystemCode} from '../types/common';
import {SocketMessageType} from '../types/socket';
import {TaskFlowStatus, TaskReportStatus} from '../types/task';

import {queryConnectionById} from './connection';
import {queryTaskById, verifyTaskOwner} from './task';
import {createTaskReports, pendTaskReportByFlowId, queryTaskReportMap} from './task_report';

import {buildAndRunBotphusTask, sendTaskFlowData} from '../modules/task_flow';
import {app, createSystemError, localePkg} from '../modules/util';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id name status startPage taskId createdAt updateAt';

/**
 * Query task flow info by ID
 * @param  {Schema.Types.ObjectId}   taskFlowId Task flow ID
 * @param  {string}                  fields     Field list
 * @return {Promise<ITaskFlowModel>}            Promise with TaskFlow Info
 */
export function queryTaskFlowById(taskFlowId: Schema.Types.ObjectId, fields: string = null): Promise<ITaskFlowModel> {
    return TaskFlow.findById(taskFlowId, fields).exec();
}

/**
 * Query task flow list
 * @param  {IUserSearchModel}                    query    Query condition
 * @param  {number}                              page     Page
 * @param  {number}                              pageSize Page size
 * @param  {string}                              fields   Field list
 * @return {Promise<[number, ITaskFlowModel[]]>}          Promise with total number & task flow info list
 */
export function queryTaskFlowList(query: ITaskFlowSearchModel, page: number, pageSize: number, fields: string = defaultFields): Promise<[number, ITaskFlowModel[]]> {
    const condition: any = {};
    if (query.name) {
        condition.name = {
            $regex: query.name
        };
    }
    if (query.createdUser) {
        condition.createdUser = query.createdUser;
    }
    if (query.status) {
        condition.status = query.status;
    }
    return Promise.all([
        TaskFlow.countDocuments(condition).exec(),
        TaskFlow.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Query task flow detail by user
 * @param  {Schema.Types.ObjectId}         taskFlowId Task flow ID
 * @param  {string}                        userId     User ID
 * @return {Promise<ITaskFlowDetailModel>}            Promise with Task flow Info
 */
export function queryTaskFlowByUser(taskFlowId: Schema.Types.ObjectId, userId: string): Promise<ITaskFlowDetailModel> {
    return queryTaskFlowById(taskFlowId)
        .then((taskFlow) => {
            if (taskFlow.createdUser.toString() === userId) {
                return taskFlow;
            }
            throw createSystemError(localePkg.Service.Common.visitForbidden, SystemCode.FORBIDDEN);
        })
        .then((taskFlow) => {
            return Promise.all([
                Promise.resolve(taskFlow),
                queryTaskById(taskFlow.taskId, 'name ruleItems pageType updateAt'), // Task info
                queryTaskReportMap(taskFlow._id), // Task report map
                taskFlow.mysqlId ? queryConnectionById(taskFlow.mysqlId, 'name config') : Promise.resolve(null), // Mysql
                taskFlow.redisId ? queryConnectionById(taskFlow.redisId, 'name config') : Promise.resolve(null) // Redis
            ]);
        })
        .then(([taskFlow, taskDetail, taskReportMap, mysqlDetail, redisDetail]) => {
            const taskFlowDetail: ITaskFlowDetailModel = Object.assign(taskFlow.toObject(), {
                taskDetail,
                taskReportMap
            });
            if (mysqlDetail) {
                taskFlowDetail.mysqlDetail = mysqlDetail;
            }
            if (redisDetail) {
                taskFlowDetail.redisDetail = redisDetail;
            }
            return taskFlowDetail;
        });
}

/**
 * Createa task flow info
 * @param  {ITaskFlowModel}          taskFlowData Task flow data
 * @param  {string}                  createUser   Create User ID
 * @return {Promise<ITaskFlowModel>}              Promise with task flow Info
 */
export function createTaskFlow(taskFlowData: ITaskFlowModel, createUser: string): Promise<ITaskFlowModel> {
    const taskFlow = Object.assign(new TaskFlow(), taskFlowData, {
        status: TaskReportStatus.PENDING
    });
    taskFlow.createdUser = Types.ObjectId(createUser);
    return verifyTaskOwner(taskFlow.taskId, createUser)
        .then(() => {
            return taskFlow.save();
        })
        .then((flowData) => {
            return queryTaskById(flowData.taskId, '_id ruleItems') // Query task rules data
                .then((taskData) => {
                    const data: ITaskReportBaseItem[] = taskData.ruleItems.map((taskRule) => {
                        return {
                            flowId: flowData.id,
                            index: `${taskRule.id}`,
                            message: '',
                            status: flowData.excludeOption[`${taskRule.id}`] ? TaskReportStatus.IGNORE : TaskReportStatus.PENDING,
                        };
                    });
                    return createTaskReports(data);
                })
                .then(() => {
                    return flowData;
                });
        });
}

/**
 * modify task flow by ID
 * @param  {Schema.Types.ObjectId} taskFlowId   Task flow ID
 * @param  {ITaskFlowModifyModel}  taskFlowData task update flow ID
 * @return {Promise<any>}                       Promise with task report id
 */
export function modifyTaskFlowById(taskFlowId: Schema.Types.ObjectId, taskFlowData: ITaskFlowModifyModel): Promise<any> {
    return TaskFlow.updateOne({
        _id: taskFlowId
    }, taskFlowData).exec();
}

/**
 * Start task flow
 * @param  {Schema.Types.ObjectId} taskFlowId Task flow ID
 * @param  {string}                userId     Create User ID
 * @return {Promise<void>}                    Promise
 */
export function startTaskFlow(taskFlowId: Schema.Types.ObjectId, userId: string): Promise<void> {
    return queryTaskFlowByUser(taskFlowId, userId)
        .then((flowData) => {
            // Check flow create date is before task update time
            if (new Date(flowData.createdAt) < new Date(flowData.taskDetail.updateAt)) {
                modifyTaskFlowById(taskFlowId, {
                    status: TaskFlowStatus.CLOSE
                });
                throw createSystemError(localePkg.Service.TaskFlow.startForbidden, SystemCode.FORBIDDEN);
            }
            return pendTaskReportByFlowId(taskFlowId)
                .then(() => {
                    modifyTaskFlowById(flowData._id, {
                        status: TaskFlowStatus.ONGOING
                    });
                    return buildAndRunBotphusTask(flowData);
                })
                .then((subProcess) => {
                    subProcess.on('close', (code) => {
                        const status = code === 0 || !code ? TaskFlowStatus.SUCCESS : TaskFlowStatus.FAILED;
                        modifyTaskFlowById(flowData._id, {
                            status
                        });
                        sendTaskFlowData(flowData.taskReportMap[Object.keys(flowData.taskReportMap)[0]], {
                            message: `${status}`
                        }, userId, SocketMessageType.END);
                        app.log.debug('Process close code:', code);
                    });
                });
        });
}

/**
 * Modify task flows
 * @param  {any}                    query      Update query condition
 * @param  {ITaskReportModifyModel} updateData Update data
 * @return {Promise<any>}                      Promise
 */
export function modifyTaskFlows(query: any, updateData: ITaskFlowModifyModel): Promise<any> {
    return TaskFlow.updateMany(query, updateData)
        .exec();
}
