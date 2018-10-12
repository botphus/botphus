import {Schema} from 'mongoose';

import {User} from '../models/';

import {IUserCreateModel, IUserModel, IUserModifyModel, IUserSearchModel} from '../interfaces/model';

import {createSystemError, localePkg, translatePassword} from '../modules/util';

import {SystemCode} from '../types/common';
import {emailLength, strLength} from '../types/rules';
import {UserPermissionCode} from '../types/user';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id email nickname permission';

/**
 * Query user's info by user ID
 * @param  {Schema.Types.ObjectId} userId User ID
 * @param  {string}                fields Field list
 * @return {Promise<IUserModel>}          Promise with user info
 */
export function queryUserById(userId: Schema.Types.ObjectId, fields: string = defaultFields): Promise<IUserModel> {
    return User.findById(userId, fields).exec();
}

/**
 * Query user's info by user ID list
 * @param  {Schema.Types.ObjectId[]} userIds User ID list
 * @param  {string}                  fields  Field list
 * @return {Promise<IUserModel[]>}           Promise with user info list
 */
export function queryUserByIds(userIds: Schema.Types.ObjectId[], fields: string = defaultFields): Promise<IUserModel[]> {
    return User.find({
        _id: {
            $in: userIds
        }
    }, fields).exec();
}

/**
 * Query data by user's email
 * @param  {string}              email    User's email
 * @param  {string}              password User's password
 * @param  {string}              fields   Field list
 * @return {Promise<IUserModel>}          Promise with user info
 */
export function queryUserByEmail(email: string, fields: string = null): Promise<IUserModel> {
    return User.findOne({
        email
    }, fields).exec();
}

/**
 * Query user total count
 * @param  {IUserSearchModel} query Query condition
 * @return {Promise<number>}        Promise with total number
 */
export function queryUserTotalCount(): Promise<number> {
    return User.count({}).exec();
}

/**
 * Query user list
 * @param  {IUserSearchModel}                query    Query condition
 * @param  {number}                          page     Page
 * @param  {number}                          pageSize Page size
 * @param  {string}                          fields   Field list
 * @return {Promise<[number, IUserModel[]]>}          Promise with total number & user info list
 */
export function queryUserList(query: IUserSearchModel, page: number, pageSize: number, fields: string): Promise<[number, IUserModel[]]> {
    const condition: any = {};
    if (query.nickname && query.nickname.length >= strLength[0] && query.nickname.length <= strLength[0]) {
        condition.nickname = {
            $regex: query.nickname
        };
    }
    if (query.email && query.email.length >= emailLength[0] && query.email.length <= emailLength[0]) {
        condition.email = query.email;
    }
    if (typeof query.enable === 'boolean') {
        condition.enable = query.enable;
    }
    return Promise.all([
        User.count(condition).exec(),
        User.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * verify user permission with userId
 * @param  {Schema.Types.ObjectId} userId         User ID
 * @param  {UserPermissionCode}    permissionCode Permission code
 * @param  {string}                fields         Field list
 * @return {Promise<IUserModel>}                  Promise with user info
 */
export function verifyPermissionById(userId: Schema.Types.ObjectId, permissionCode: UserPermissionCode, fields: string = defaultFields): Promise<IUserModel> {
    return queryUserById(userId, fields)
        .then((data) => {
            if (data.permission && (data.permission ^ permissionCode) > 0) {
                return data;
            }
            throw createSystemError(localePkg.Service.User.permissionForbidden, SystemCode.FORBIDDEN);
        });
}

/**
 * Verify user's password
 * @param  {IUserModel} userInfo User's info
 * @param  {string}     password Password string
 * @return {IUserModel}          if true return User's info, else return null
 */
export function verifyUserPassword(userInfo: IUserModel, password: string): IUserModel {
    if (userInfo.password === translatePassword(password)) {
        return userInfo;
    }
    return null;
}

/**
 * Create user
 * @param  {IUserCreateModel}    userData Create user data
 * @return {Promise<IUserModel>}          Promise with user info
 */
export function createUser(userData: IUserCreateModel): Promise<IUserModel> {
    return queryUserByEmail(userData.email)
        .then((data) => {
            if (data) {
                throw createSystemError(localePkg.Service.User.emailVerifyError, SystemCode.MONGO_UNIQUE_ERROR);
            }
            const user = Object.assign(new User(), userData);
            return user.save();
        });
}

/**
 * Modify user's data by user id
 * @param  {Schema.Types.ObjectId} userId   User ID
 * @param  {IUserModifyModel}      userData Update user data
 * @return {Promise<IUserModel>}            Promise with user info
 */
export function modifyUserById(userId: Schema.Types.ObjectId, userData: IUserModifyModel): Promise<IUserModel> {
    let promiseFunc: Promise<IUserModel>;
    // Check if email exists
    if (userData.email) {
        promiseFunc = queryUserByEmail(userData.email);
    } else {
        promiseFunc = Promise.resolve(null);
    }
    return promiseFunc
        // Check email
        .then((searchUser) => {
            if (searchUser && searchUser._id !== userId) {
                throw createSystemError(localePkg.Service.User.emailVerifyError, SystemCode.MONGO_UNIQUE_ERROR);
            }
            return null;
        })
        .then(() => {
            // Update password
            if (userData.password) {
                userData.password = translatePassword(userData.password);
            }
            return User.findByIdAndUpdate(userId, userData).exec();
        });
}
