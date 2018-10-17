import {Schema} from 'mongoose';

import {Task} from '../models/';

import {ITaskModel, ITaskModifyModel, ITaskSearchModel} from '../interfaces/model';

import {strLength} from '../types/rules';

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
 * @param  {IUserSearchModel}                    query    Query condition
 * @param  {number}                              page     Page
 * @param  {number}                              pageSize Page size
 * @param  {string}                              fields   Field list
 * @return {Promise<[number, ITaskModel[]]>}              Promise with total number & task info list
 */
export function queryTaskList(query: ITaskSearchModel, page: number, pageSize: number, fields: string): Promise<[number, ITaskModel[]]> {
    const condition: any = {};
    if (query.name && query.name.length >= strLength[0] && query.name.length <= strLength[0]) {
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
                memebers: query.userId
            }
        ];
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
 * @param  {Schema.Types.ObjectId} userId User ID
 * @return {Promise<ITaskModel>}          Promise with Task Info
 */
export function verifyTaskOwner(taskId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId): Promise<ITaskModel> {
    return queryTaskById(taskId)
        .then((task) => {
            if (task && task.createdUser === userId || task.memebers.indexOf(userId) >= 0) {
                return task;
            }
            return null;
        });
}

/**
 * Createa task info
 * @param  {ITaskModel}          taskData Task data
 * @return {Promise<ITaskModel>}          Promise with task Info
 */
export function createTask(taskData: ITaskModel): Promise<ITaskModel> {
    const task = Object.assign(new Task(), taskData);
    return task.save();
}

/**
 * Modify task info
 * @param  {Schema.Types.ObjectId} taskId   Task ID
 * @param  {ITaskModifyModel}      taskData Task data
 * @return {Promise<ITaskModel>}            Promise with task Info
 */
export function modifyTaskById(taskId: Schema.Types.ObjectId, taskData: ITaskModifyModel): Promise<ITaskModel> {
    return Task.updateOne({
        _id: taskId
    }, taskData).exec();
}
