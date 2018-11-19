import {Schema} from 'mongoose';

import {User} from '../models/';

import {IUserCreateModel, IUserModel, IUserModifyModel, IUserReferMap, IUserSearchModel, IUserSession} from '../interfaces/model';
import {SystemCode} from '../types/common';
import {UserPermissionCode} from '../types/user';

import {checkUserPermission, createSystemError, localePkg, translatePassword} from '../modules/util';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id email nickname permission enable';

/**
 * Query user's info by user ID
 * @param  {string}              userId User ID
 * @param  {string}              fields Field list
 * @return {Promise<IUserModel>}        Promise with user info
 */
export function queryUserById(userId: string, fields: string = defaultFields): Promise<IUserModel> {
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
 * Query user's info by user ID, and rebuild with map
 * @param  {Schema.Types.ObjectId[]} userIds User ID list
 * @return {Promise<IUserReferMap>}          User refer map
 */
export function queryUserByIdsWithReferMap(userIds: Schema.Types.ObjectId[]): Promise<IUserReferMap> {
    return queryUserByIds(userIds, '_id nickname')
        .then((users) => {
            const userReferMap: IUserReferMap = {};
            users.forEach((user) => {
                userReferMap[user._id] = user;
            });
            return userReferMap;
        });
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
    if (query.nickname) {
        condition.nickname = {
            $regex: query.nickname
        };
    }
    if (query.email) {
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
 * @param  {string}              userId   User ID
 * @param  {string}              userData Update user data
 * @return {Promise<IUserModel>}          Promise with user info
 */
export function modifyUserById(userId: string, modifyUserId: string, modifyUserPermission: number, userData: IUserModifyModel): Promise<any> {
    // Check permission for profile edit & special field
    if ((modifyUserId !== userId || userData.permission >= 0 || typeof userData.enable === 'boolean')
        && !checkUserPermission(modifyUserPermission, UserPermissionCode.SYSTEM)) {
        return Promise.reject(createSystemError(localePkg.SystemCode.permissionForbidden, SystemCode.FORBIDDEN));
    }
    // Check permission, root permission can't change
    // 1. Current user is root
    // 2. Update permission has root
    if (userData.permission > 0 && ((modifyUserPermission & UserPermissionCode.ROOT) || (userData.permission & UserPermissionCode.ROOT))) {
        return Promise.reject(createSystemError(localePkg.Service.User.rootPermissionError, SystemCode.FORBIDDEN));
    }
    // Update password
    if (userData.password) {
        userData.password = translatePassword(userData.password);
    }
    return User.updateOne({
        _id: userId
    }, userData).exec();
}

/**
 * Get user session data
 * @param  {IUserModel}   user User data
 * @return {IUserSession}      User session data
 */
export function getUserSession(user: IUserModel): IUserSession {
    return {
        email: user.email,
        id: user._id.toString(),
        nickname: user.nickname,
        permission: user.permission
    };
}
