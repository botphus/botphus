import {Schema} from 'mongoose';

import {User} from '../models/';

import {IUserCreateModel, IUserModel, IUserModifyModel, IUserSearchModel} from '../interfaces/model';
import {SystemCode} from '../types/common';
import {emailLength, strLength} from '../types/rules';
import {UserPermissionCode} from '../types/user';

import {checkUserPermission, createSystemError, localePkg, translatePassword} from '../modules/util';

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
        email,
        enable: true
    }, fields).exec();
}

/**
 * Query user total count
 * @param  {IUserSearchModel} query Query condition
 * @return {Promise<number>}        Promise with total number
 */
export function queryUserTotalCount(): Promise<number> {
    return User.countDocuments({}).exec();
}

/**
 * Query user list
 * @param  {IUserSearchModel}                query    Query condition
 * @param  {number}                          page     Page
 * @param  {number}                          pageSize Page size
 * @param  {string}                          fields   Field list
 * @return {Promise<[number, IUserModel[]]>}          Promise with total number & user info list
 */
export function queryUserList(query: IUserSearchModel, page: number, pageSize: number, fields: string = defaultFields): Promise<[number, IUserModel[]]> {
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
        User.countDocuments(condition).exec(),
        User.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Verify user's password
 * @param  {IUserModel} userInfo User's info
 * @param  {string}     password Password string
 * @return {IUserModel}          If true return User's info, else return null
 */
export function verifyUserPassword(userInfo: IUserModel, password: string): IUserModel {
    if (userInfo.password === translatePassword(password)) {
        return userInfo;
    }
    return null;
}

/**
 * Verify user login info
 * @param  {string}              email    User's email
 * @param  {string}              password User's password
 * @return {Promise<IUserModel>}          If true return User's info, else return null
 */
export function verifyUserLogin(email: string, password: string): Promise<IUserModel> {
    return queryUserByEmail(email)
        .then((user) => {
            if (user) {
                return verifyUserPassword(user, password);
            }
            return null;
        })
        .then((user) => {
            if (user) {
                return user;
            }
            throw createSystemError(localePkg.Service.User.loginError, SystemCode.ROUTINE_ERROR);
        });
}

/**
 * Create user
 * @param  {IUserCreateModel}    userData Create user data
 * @return {Promise<IUserModel>}          Promise with user info
 */
export function createUser(userData: IUserCreateModel): Promise<IUserModel> {
    const user = Object.assign(new User(), userData, {
        password: translatePassword(userData.password)
    });
    return user.save();
}

/**
 * Modify user's data by user id
 * @param  {Schema.Types.ObjectId} userId   User ID
 * @param  {IUserModifyModel}      userData Update user data
 * @return {Promise<IUserModel>}            Promise with user info
 */
export function modifyUserById(userId: Schema.Types.ObjectId, modifyUserId: Schema.Types.ObjectId, modifyUserPermission: number, userData: IUserModifyModel): Promise<IUserModel> {
    // Check permission for profile edit & special field
    if ((modifyUserId !== userId || userData.permission || userData.enable) && !checkUserPermission(modifyUserPermission, UserPermissionCode.SYSTEM)) {
        return Promise.reject(createSystemError(localePkg.SystemCode.permissionForbidden, SystemCode.FORBIDDEN));
    }
    // Update password
    if (userData.password) {
        userData.password = translatePassword(userData.password);
    }
    return User.updateOne({
        _id: userId
    }, userData).exec();
}
