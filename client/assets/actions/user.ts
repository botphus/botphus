import {message} from 'antd';

import {IActionData} from '../interfaces/redux';
import {ActionCallbackFunc, ActionThunkFunc, ActionType} from '../types/redux';
import {RequestAction} from '../types/request';

import {updateModel} from './modal';

import request from '../lib/request';
import {translatePwd} from '../lib/util';

// actions
/**
 * Install & create an admin account
 * @param  {any}                query    Create data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function postInstallData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.INSTALL, Object.assign({}, query, {
            password: translatePwd(query.password)
        }), 'POST')
            .then((res) => {
                dispatch(updateModel({
                    loadingForm: false
                }));
                if (callback) {
                    callback(res);
                }
            }).catch((err) => {
                dispatch(updateModel({
                    loadingForm: false
                }));
                message.error(err.message);
            });
    };
}

/**
 * Login with email & password
 * @param  {any}                query    User data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function postLoginData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.LOGIN, Object.assign({}, query, {
            password: translatePwd(query.password)
        }), 'POST')
            .then((res) => {
                dispatch(updateModel({
                    loadingForm: false
                }));
                dispatch(updateUserOwner(res.data));
                if (callback) {
                    callback(res);
                }
            }).catch((err) => {
                dispatch(updateModel({
                    loadingForm: false
                }));
                message.error(err.message);
            });
    };
}

/**
 * Logout
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function postLogout(callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.LOGOUT)
            .then((res) => {
                dispatch(updateModel({
                    loading: false
                }));
                if (callback) {
                    callback(res);
                }
            }).catch((err) => {
                dispatch(updateModel({
                    loading: false
                }));
                message.error(err.message);
            });
    };
}

/**
 * Update user data
 * @param  {any}                query    User data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function modifyUserData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        const sendData = Object.assign({}, query);
        if (sendData.password) {
            sendData.password = translatePwd(query.password);
        } else {
            delete sendData.password;
        }
        request(RequestAction.USER, sendData, 'PATCH')
            .then((res) => {
                dispatch(updateModel({
                    loadingForm: false
                }));
                if (callback) {
                    callback(res);
                }
            }).catch((err) => {
                dispatch(updateModel({
                    loadingForm: false
                }));
                message.error(err.message);
            });
    };
}

/**
 * Query user self data
 * @return {ActionThunkFunc} [description]
 */
export function queryUserOwnerData(): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.USER_SELF_PROFILE)
            .then((res) => {
                dispatch(updateModel({
                    loading: false
                }));
                dispatch(updateUserOwner(res.data));
            }).catch((err) => {
                dispatch(updateModel({
                    loading: false
                }));
                message.error(err.message);
            });
    };
}

/**
 * Query user detail data
 * @param  {string}          userId User ID
 * @return {ActionThunkFunc}        Thunk fuction
 */
export function queryUserDetailData(userId: string): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.USER_PROFILE, {
            id: userId
        })
            .then((res) => {
                dispatch(updateModel({
                    loading: false
                }));
                dispatch(updateUserDetail(res.data));
            }).catch((err) => {
                dispatch(updateModel({
                    loading: false
                }));
                message.error(err.message);
            });
    };
}

/**
 * Query user list data
 * @return {ActionThunkFunc} [description]
 */
export function queryUserListData(query: any): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingTable: true
        }));
        request(RequestAction.USER, query)
            .then((res) => {
                dispatch(updateModel({
                    loadingTable: false
                }));
                dispatch(updateUserList(res.data));
            }).catch((err) => {
                dispatch(updateModel({
                    loadingTable: false
                }));
                message.error(err.message);
            });
    };
}

/**
 * Update user list
 * @param  {any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUserList(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_USER_LIST,
    };
}

/**
 * Clean user list
 * @return {IActionData} Action
 */
export function cleanUserList(): IActionData {
    return {
        type: ActionType.CLEAN_USER_LIST
    };
}

/**
 * Update user detail
 * @param  {Any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUserDetail(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_USER_DETAIL,
    };
}

/**
 * Clean user detail
 * @return {IActionData} Action
 */
export function cleanUserDetail(): IActionData {
    return {
        type: ActionType.CLEAN_USER_DETAIL
    };
}

/**
 * Update user owner info
 * @param  {Any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUserOwner(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_USER_OWNER,
    };
}
