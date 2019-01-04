import {Schema} from 'mongoose';

import {UserGroup} from '../models/';

import {IUserGroupModel, IUserGroupModifyModel, IUserGroupReferModel, IUserGroupSearchModel} from '../interfaces/model';

import {queryUserByIdsWithReferMap} from './user';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id name members createdAt updateAt';

/**
 * Query user group's info by user group ID
 * @param  {Schema.Types.ObjectId}    userGroupId User group ID
 * @param  {string}                   fields      Field list
 * @return {Promise<IUserGroupModel>}             Promise with user group info
 */
export function queryUserGroupById(userGroupId: Schema.Types.ObjectId, fields: string = defaultFields): Promise<IUserGroupModel> {
    return UserGroup.findById(userGroupId, fields).exec();
}

/**
 * Query user group's info by user group ID list
 * @param  {Schema.Types.ObjectId[]}    userGroupIds User group ID list
 * @param  {string}                     fields       Field list
 * @return {Promise<IUserGroupModel[]>}              Promise with user group info list
 */
export function queryUserGroupByIds(userGroupIds: Schema.Types.ObjectId[], fields: string = defaultFields): Promise<IUserGroupModel[]> {
    return UserGroup.find({
        _id: {
            $in: userGroupIds
        }
    }, fields).exec();
}

/**
 * Query current user's group list
 * @param  {Schema.Types.ObjectId}      userId User ID
 * @param  {string}                     fields Field list
 * @return {Promise<IUserGroupModel[]>}        Promise with user group info list
 */
export function queryUserGroupByUserId(userId: string, fields: string = defaultFields): Promise<IUserGroupModel[]> {
    return UserGroup.find({
        members: userId
    }, fields).exec();
}

/**
 * Query user group by id with users info
 * @param  {Schema.Types.ObjectId}   userGroupId User group ID
 * @return {Promise<ITaskUserModel>}             User group info with user info
 */
export function queryUserGroupByIdWithUsers(userGroupId: Schema.Types.ObjectId): Promise<IUserGroupReferModel> {
    return queryUserGroupById(userGroupId)
        .then((userGroup) => {
            const userGroupInfo: IUserGroupReferModel = Object.assign({}, userGroup.toObject());
            return queryUserByIdsWithReferMap(userGroup.members)
                .then((userMap) => {
                    userGroupInfo.members = userGroup.members.map((groupUserId) => {
                        return userMap[groupUserId.toString()];
                    }).filter((userInfo) => {
                        return !!userInfo;
                    });
                    return userGroupInfo;
                });
        });
}

/**
 * [queryUserGroupList description]
 * @param  {IUserGroupSearchModel} query    Query condition
 * @param  {number}                page     Page
 * @param  {number}                pageSize Page size
 * @param  {string}                fields   Field list
 * @return {Promise}                        Promise with total number & user group info list
 */
export function queryUserGroupList(query: IUserGroupSearchModel, page: number, pageSize: number, fields: string = defaultFields): Promise<[number, IUserGroupModel[]]> {
    const condition: any = {};
    if (query.name) {
        condition.name = {
            $regex: query.name
        };
    }
    return Promise.all([
        UserGroup.countDocuments(condition).exec(),
        UserGroup.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Create user group
 * @param  {IUserGroupModel}          userGroupData Create user group data
 * @return {Promise<IUserGroupModel>}               Promise with user info
 */
export function createUserGroup(userGroupData: IUserGroupModel): Promise<IUserGroupModel> {
    const user = Object.assign(new UserGroup(), userGroupData);
    return user.save();
}

/**
 * Modify user group's data by user id
 * @param  {string}                userGroupId   User group ID
 * @param  {IUserGroupModifyModel} userGroupData Update user group data
 * @return {Promise<any>}                        Promise with update info
 */
export function modifyUserGroupById(userGroupId: string, userGroupData: IUserGroupModifyModel): Promise<any> {
    return UserGroup.updateOne({
        _id: userGroupId
    }, userGroupData).exec();
}
