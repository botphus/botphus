import {Schema, Types} from 'mongoose';

import {Task} from '../models/';

import {ITaskModel, ITaskModifyModel, ITaskSearchModel, ITaskUserModel} from '../interfaces/model';
import {SystemCode} from '../types/common';

import {createSystemError, localePkg} from '../modules/util';

import {queryUserByIdsWithReferMap} from './user';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id pageType name createdAt updateAt';

/**
 * Query Task info by id
 * @param  {Schema.Types.ObjectId} taskId Task ID
 * @param  {string}                fields Field list
 * @return {Promise<ITaskModel>}          Promise with Task Info
 */
export function queryTaskById(taskId: Schema.Types.ObjectId, fields: string = null): Promise<ITaskModel> {
    return Task.findById(taskId, fields).exec();
}

/**
 * Query Task list
 * @param  {IUserSearchModel}                query    Query condition
 * @param  {number}                          page     Page
 * @param  {number}                          pageSize Page size
 * @param  {string}                          fields   Field list
 * @return {Promise<[number, ITaskModel[]]>}          Promise with total number & task info list
 */
export function queryTaskList(query: ITaskSearchModel, page: number, pageSize: number, fields: string = defaultFields): Promise<[number, ITaskModel[]]> {
    const condition: any = {};
    if (query.name) {
        condition.name = {
            $regex: query.name
        };
    }
    if (query.userId) {
        condition.$or = [
            {
                createdUser: query.userId
            },
            {
                members: query.userId
            }
        ];
    }
    if (query.pageType) {
        condition.pageType = query.pageType;
    }
    return Promise.all([
        Task.countDocuments(condition).exec(),
        Task.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Verify task's owner
 * @param  {Schema.Types.ObjectId} taskId Task ID
 * @param  {string}                userId User ID
 * @return {Promise<ITaskModel>}          Promise with Task Info
 */
export function verifyTaskOwner(taskId: Schema.Types.ObjectId, userId: string): Promise<ITaskModel> {
    return queryTaskById(taskId)
        .then((task) => {
            if (task && (task.createdUser.toString() === userId || task.members.some((memberId) => {
                return memberId.toString() === userId;
            }))) {
                return task;
            }
            throw createSystemError(localePkg.Service.Common.visitForbidden, SystemCode.FORBIDDEN);
        });
}

/**
 * Createa task info
 * @param  {ITaskModel}            taskData   Task data
 * @param  {string}                createUser Create user ID
 * @return {Promise<ITaskModel>}              Promise with task Info
 */
export function createTask(taskData: ITaskModel, createUser: string): Promise<ITaskModel> {
    const task = Object.assign(new Task(), taskData);
    task.createdUser = Types.ObjectId(createUser);
    return task.save();
}

/**
 * [queryTaskByUsers description]
 * @param  {Schema.Types.ObjectId} taskId Task ID
 * @return {Promise<ITaskModel>}          User ID
 */
export function queryTaskByIdWithUsers(taskId: Schema.Types.ObjectId, userId: string): Promise<ITaskUserModel> {
    return verifyTaskOwner(taskId, userId)
        .then((task) => {
            const taskInfo: ITaskUserModel = Object.assign({}, task.toObject());
            return queryUserByIdsWithReferMap(task.members.concat([taskInfo.createdUser]))
                .then((userMap) => {
                    taskInfo.members = task.members.map((taskUserId) => {
                        return userMap[taskUserId.toString()];
                    });
                    taskInfo.createdUserName = userMap[taskInfo.createdUser.toString()].nickname;
                    return taskInfo;
                });
        });
}

/**
 * Modify task info
 * @param  {Schema.Types.ObjectId} taskId   Task ID
 * @param  {string}                userId   User ID
 * @param  {ITaskModifyModel}      taskData Task data
 * @return {Promise<ITaskModel>}            Promise with task Info
 */
export function modifyTaskById(taskId: Schema.Types.ObjectId, userId: string, taskData: ITaskModifyModel): Promise<any> {
    return verifyTaskOwner(taskId, userId)
        .then(() => {
            return Task.updateOne({
                _id: taskId
            }, taskData).exec();
        });
}
