import {Schema} from 'mongoose';

import {TaskFlow} from '../models/';

import {ITaskFlowModel, ITaskFlowSearchModel} from '../interfaces/model';

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
export function queryTaskFlowList(query: ITaskFlowSearchModel, page: number, pageSize: number, fields: string): Promise<[number, ITaskFlowModel[]]> {
    const condition: any = {};
    if (query.taskId) {
        condition.taskId = query.taskId;
    }
    if (query.createdUser) {
        condition.createdUser = query.createdUser;
    }
    return Promise.all([
        TaskFlow.countDocuments(condition).exec(),
        TaskFlow.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Createa task flow info
 * @param  {ITaskFlowModel}          taskFlowData Task flow data
 * @return {Promise<ITaskFlowModel>}              Promise with task flow Info
 */
export function createTaskFlow(taskFlowData: ITaskFlowModel): Promise<ITaskFlowModel> {
    const taskFlow = Object.assign(new TaskFlow(), taskFlowData);
    return taskFlow.save();
}
