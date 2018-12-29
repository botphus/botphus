import {Schema, Types} from 'mongoose';

import {UnionTask} from '../models/';

import {IIndexMap} from '../interfaces/common';
import {IUnionTaskModel, IUnionTaskModifyModel, IUnionTaskSearchModel, IUnionTaskUserModel} from '../interfaces/model';
import {SystemCode} from '../types/common';
import {TaskFlowStatus, TaskStatus} from '../types/task';

import {createSystemError, localePkg} from '../modules/util';

import {modifyUnionTaskFlows} from './union_task_flow';
import {queryUserByIdsWithReferMap} from './user';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id name createdAt updateAt createdUser';

/**
 * Query Union task info by id
 * @param  {Schema.Types.ObjectId}    unionTaskId Union task ID
 * @param  {string}                   fields      Field list
 * @return {Promise<IUnionTaskModel>}             Promise with Task Info
 */
export function queryUnionTaskById(unionTaskId: Schema.Types.ObjectId, fields: string = null): Promise<IUnionTaskModel> {
    return UnionTask.findById(unionTaskId, fields).exec();
}

/**
 * Query union task list
 * @param  {IUnionTaskSearchModel} query    Query condition
 * @param  {number}                page     Page
 * @param  {number}                pageSize Page size
 * @param  {string}                fields   Field list
 * @return {Promise}                        Promise with total number & union task info list
 */
export function queryUnionTaskList(query: IUnionTaskSearchModel, page: number, pageSize: number, fields: string = defaultFields): Promise<[number, IUnionTaskModel[]]> {
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
    if (query.status) {
        condition.status = query.status;
    }
    return Promise.all([
        UnionTask.countDocuments(condition).exec(),
        UnionTask.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Query union task list by ids
 * @param  {Schema.Types.ObjectId[]}    ids    Union task ids
 * @param  {string}                     fields Field list
 * @return {Promise<IUnionTaskModel[]>}        Promise with union task info list
 */
export function queryUnionTaskListByIds(ids: Schema.Types.ObjectId[], fields: string = defaultFields): Promise<IUnionTaskModel[]> {
    return UnionTask.find({
        _id: {
            $in: ids
        }
    }).select(fields).exec();
}

/**
 * Query union task map by ids
 * @param  {Schema.Types.ObjectId[]}             ids    Union task ids
 * @param  {string}                              fields Field list
 * @return {Promise<IIndexMap<IUnionTaskModel>>}        Promise with union union task info map
 */
export function queryUnionTaskMapByIds(ids: Schema.Types.ObjectId[], fields: string = defaultFields): Promise<IIndexMap<IUnionTaskModel>> {
    if (ids.length === 0) {
        return Promise.resolve({});
    }
    return queryUnionTaskListByIds(ids, fields)
        .then((unionTaskList) => {
            const unionTaskMap: IIndexMap<IUnionTaskModel> = {};
            unionTaskList.forEach((task) => {
                unionTaskMap[task._id] = task;
            });
            return unionTaskMap;
        });
}

/**
 * Query union task info by ID with users' info
 * @param  {Schema.Types.ObjectId}        unionTaskId Union task ID
 * @param  {string}                       userId      User ID
 * @return {Promise<IUnionTaskUserModel>}             Promise with task info with users' info
 */
export function queryUnionTaskByIdWithUsers(unionTaskId: Schema.Types.ObjectId, userId: string): Promise<IUnionTaskUserModel> {
    return verifyUnionTaskOwner(unionTaskId, userId)
        .then((unionTask) => {
            const unionTaskInfo: IUnionTaskUserModel = Object.assign({}, unionTask.toObject());
            return queryUserByIdsWithReferMap(unionTask.members.concat([unionTaskInfo.createdUser]))
                .then((userMap) => {
                    unionTaskInfo.members = unionTask.members.map((taskUserId) => {
                        return userMap[taskUserId.toString()];
                    }).filter((userInfo) => {
                        return !!userInfo;
                    });
                    unionTaskInfo.createdUserName = userMap[unionTaskInfo.createdUser.toString()].nickname;
                    return unionTaskInfo;
                });
        });
}

/**
 * Verify union task's owner
 * @param  {Schema.Types.ObjectId}    unionTaskId Union Task ID
 * @param  {string}                   userId      User ID
 * @return {Promise<IUnionTaskModel>}             Promise with union task Info
 */
export function verifyUnionTaskOwner(unionTaskId: Schema.Types.ObjectId, userId: string): Promise<IUnionTaskModel> {
    return queryUnionTaskById(unionTaskId)
        .then((unionTask) => {
            if (unionTask && (unionTask.createdUser.toString() === userId || unionTask.members.some((memberId) => {
                return memberId.toString() === userId;
            }))) {
                return unionTask;
            }
            throw createSystemError(localePkg.Service.Common.visitForbidden, SystemCode.FORBIDDEN);
        });
}

/**
 * Verify union task's creator
 * @param  {Schema.Types.ObjectId}    unionTaskId Union Task ID
 * @param  {string}                   userId      User ID
 * @return {Promise<IUnionTaskModel>}             Promise with union task Info
 */
export function verifyUnionTaskCreator(unionTaskId: Schema.Types.ObjectId, userId: string): Promise<IUnionTaskModel> {
    return queryUnionTaskById(unionTaskId)
        .then((unionTask) => {
            if (unionTask && (unionTask.createdUser.toString() === userId)) {
                return unionTask;
            }
            throw createSystemError(localePkg.Service.Common.visitForbidden, SystemCode.FORBIDDEN);
        });
}

/**
 * Create union task info
 * @param  {IUnionTaskModel}          unionTaskData Union task data
 * @param  {string}                   createUser    Create user ID
 * @return {Promise<IUnionTaskModel>}               Promise with union task Info
 */
export function createUnionTask(unionTaskData: IUnionTaskModel, createUser: string): Promise<IUnionTaskModel> {
    const unionTask = Object.assign(new UnionTask(), unionTaskData);
    unionTask.createdUser = Types.ObjectId(createUser);
    return unionTask.save();
}

/**
 * Modify union task by id
 * @param  {Schema.Types.ObjectId} unionTaskId   Union task ID
 * @param  {string}                userId        User ID
 * @param  {IUnionTaskModifyModel} unionTaskData union task Data
 * @return {Promise<any>}                        Promise with action info
 */
export function modifyUnionTaskById(unionTaskId: Schema.Types.ObjectId, userId: string, unionTaskData: IUnionTaskModifyModel): Promise<any> {
    return verifyUnionTaskOwner(unionTaskId, userId)
        .then(() => {
            return modifyUnionTaskFlows({
                status: {
                    $ne: TaskFlowStatus.CLOSE
                },
                unionTaskId,
            }, {
                status: TaskFlowStatus.CLOSE
            });
        })
        .then(() => {
            return UnionTask.updateOne({
                _id: unionTaskId
            }, unionTaskData).exec();
        });
}

/**
 * Delete union task info
 * @param  {Schema.Types.ObjectId} taskId Union task ID
 * @param  {string}                userId User ID
 * @return {Promise<any>}                 Promise with action info
 */
export function deleteUnionTaskById(unionTaskId: Schema.Types.ObjectId, userId: string): Promise<any> {
    return verifyUnionTaskCreator(unionTaskId, userId)
        .then(() => {
            return UnionTask.updateOne({
                _id: unionTaskId
            }, {
                status: TaskStatus.DISABLE
            }).exec();
        });
}
