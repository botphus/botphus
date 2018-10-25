import {Schema, Types} from 'mongoose';

import {TaskFlow} from '../models/';

import {ITaskFlowModel, ITaskFlowSearchModel} from '../interfaces/model';
import {SystemCode} from '../types/common';

import {verifyTaskOwner} from './task';

import {createSystemError, localePkg} from '../modules/util';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id name startPage taskId';

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
    return Promise.all([
        TaskFlow.countDocuments(condition).exec(),
        TaskFlow.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Query task flow detail by user
 * @param  {Schema.Types.ObjectId}   taskFlowId Task flow ID
 * @param  {string}                  userId     User ID
 * @return {Promise<ITaskFlowModel>}            Promise with TaskFlow Info
 */
export function queryTaskFlowByUser(taskFlowId: Schema.Types.ObjectId, userId: string): Promise<ITaskFlowModel> {
    return queryTaskFlowById(taskFlowId)
        .then((taskFlow) => {
            if (taskFlow.createdUser.toString() === userId) {
                return taskFlow;
            }
            throw createSystemError(localePkg.Service.Common.visitForbidden, SystemCode.FORBIDDEN);
        });
}

/**
 * Createa task flow info
 * @param  {ITaskFlowModel}          taskFlowData Task flow data
 * @param  {string}                  createUser   Create User ID
 * @return {Promise<ITaskFlowModel>}              Promise with task flow Info
 */
export function createTaskFlow(taskFlowData: ITaskFlowModel, createUser: string): Promise<ITaskFlowModel> {
    const taskFlow = Object.assign(new TaskFlow(), taskFlowData);
    taskFlow.createdUser = Types.ObjectId(createUser);
    return verifyTaskOwner(taskFlow.taskId, createUser)
        .then(() => {
            return taskFlow.save();
        });
}
