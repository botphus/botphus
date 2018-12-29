import {Schema, Types} from 'mongoose';

import {Task} from '../models/';

import {IIndexMap} from '../interfaces/common';
import {ITaskModel, ITaskModifyModel, ITaskSearchModel, ITaskUserModel} from '../interfaces/model';
import {SystemCode} from '../types/common';
import {TaskFlowStatus, TaskStatus} from '../types/task';

import {createSystemError, localePkg} from '../modules/util';

import {modifyTaskFlows} from './task_flow';
import {queryUserByIdsWithReferMap} from './user';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id pageType name createdAt updateAt createdUser';

/**
 * Query task info by id
 * @param  {Schema.Types.ObjectId} taskId Task ID
 * @param  {string}                fields Field list
 * @return {Promise<ITaskModel>}          Promise with Task Info
 */
export function queryTaskById(taskId: Schema.Types.ObjectId, fields: string = null): Promise<ITaskModel> {
    return Task.findById(taskId, fields).exec();
}

/**
 * Query task list
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
    if (query.status) {
        condition.status = query.status;
    }
    return Promise.all([
        Task.countDocuments(condition).exec(),
        Task.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Query task list by ids
 * @param  {Schema.Types.ObjectId[]} ids    Task ids
 * @param  {string}                  fields Field list
 * @return {Promise<ITaskModel[]>}          Promise with task info list
 */
export function queryTaskListByIds(ids: Schema.Types.ObjectId[], fields: string = defaultFields): Promise<ITaskModel[]> {
    return Task.find({
        _id: {
            $in: ids
        }
    }).select(fields).exec();
}

/**
 * Query task map by ids
 * @param  {Schema.Types.ObjectId[]}        ids    Task ids
 * @param  {string}                         fields Field list
 * @return {Promise<IIndexMap<ITaskModel>>}        Promise with task info map
 */
export function queryTaskMapByIds(ids: Schema.Types.ObjectId[], fields: string = defaultFields): Promise<IIndexMap<ITaskModel>> {
    if (ids.length === 0) {
        return Promise.resolve({});
    }
    return queryTaskListByIds(ids, fields)
        .then((taskList) => {
            const taskMap: IIndexMap<ITaskModel> = {};
            taskList.forEach((task) => {
                taskMap[task._id] = task;
            });
            return taskMap;
        });
}

/**
 * Query task by id with users info
 * @param  {Schema.Types.ObjectId}   taskId Task ID
 * @param  {string}                  userId User ID
 * @return {Promise<ITaskUserModel>}        Task info with user info
 */
export function queryTaskByIdWithUsers(taskId: Schema.Types.ObjectId, userId: string): Promise<ITaskUserModel> {
    return verifyTaskOwner(taskId, userId)
        .then((task) => {
            const taskInfo: ITaskUserModel = Object.assign({}, task.toObject());
            return queryUserByIdsWithReferMap(task.members.concat([taskInfo.createdUser]))
                .then((userMap) => {
                    taskInfo.members = task.members.map((taskUserId) => {
                        return userMap[taskUserId.toString()];
                    }).filter((userInfo) => {
                        return !!userInfo;
                    });
                    taskInfo.createdUserName = userMap[taskInfo.createdUser.toString()].nickname;
                    return taskInfo;
                });
        });
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
 * Verify task's creator
 * @param  {Schema.Types.ObjectId} taskId Task ID
 * @param  {string}                userId User ID
 * @return {Promise<ITaskModel>}          Promise with Task Info
 */
export function verifyTaskCreator(taskId: Schema.Types.ObjectId, userId: string): Promise<ITaskModel> {
    return queryTaskById(taskId)
        .then((task) => {
            if (task && (task.createdUser.toString() === userId)) {
                return task;
            }
            throw createSystemError(localePkg.Service.Common.visitForbidden, SystemCode.FORBIDDEN);
        });
}

/**
 * Createa task info
 * @param  {ITaskModel}            taskData   Task data
 * @param  {string}                createUser Create user ID
 * @return {Promise<ITaskModel>}              Promise with action info
 */
export function createTask(taskData: ITaskModel, createUser: string): Promise<ITaskModel> {
    const task = Object.assign(new Task(), taskData);
    task.createdUser = Types.ObjectId(createUser);
    return task.save();
}

/**
 * Modify task info
 * @param  {Schema.Types.ObjectId} taskId   Task ID
 * @param  {string}                userId   User ID
 * @param  {ITaskModifyModel}      taskData Task data
 * @return {Promise<ITaskModel>}            Promise with action info
 */
export function modifyTaskById(taskId: Schema.Types.ObjectId, userId: string, taskData: ITaskModifyModel): Promise<any> {
    return verifyTaskOwner(taskId, userId)
        .then(() => {
            return modifyTaskFlows({
                status: {
                    $ne: TaskFlowStatus.CLOSE
                },
                taskId,
            }, {
                status: TaskFlowStatus.CLOSE
            });
        })
        .then(() => {
            return Task.updateOne({
                _id: taskId
            }, taskData).exec();
        });
}

/**
 * Delete task info
 * @param  {Schema.Types.ObjectId} taskId Task ID
 * @param  {string}                userId User ID
 * @return {Promise<any>}                 Promise with action info
 */
export function deleteTaskById(taskId: Schema.Types.ObjectId, userId: string): Promise<any> {
    return verifyTaskCreator(taskId, userId)
        .then(() => {
            return Task.updateOne({
                _id: taskId
            }, {
                status: TaskStatus.DISABLE
            }).exec();
        });
}
