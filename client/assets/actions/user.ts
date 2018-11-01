import {message} from 'antd';

import {IActionData} from '../interfaces/redux';
import {ActionCallbackFunc, ActionThunkFunc, ActionType} from '../types/redux';
import {RequestAction} from '../types/request';

import {updateModel} from './modal';

import request from '../lib/request';
import {connectSocket, disconnectSocket} from '../lib/socket';
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
        request(RequestAction.INSTALL, {...query,
            password: translatePwd(query.password)
        }, 'POST')
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
        request(RequestAction.LOGIN, {...query,
            password: translatePwd(query.password)
        }, 'POST')
            .then((res) => {
                dispatch(updateUserOwner(res.data));
                // Connect socket
                connectSocket();
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
 * Logout
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function postLogoutData(callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.LOGOUT)
            .then((res) => {
                dispatch(updateModel({
                    loading: false
                }));
                // Disconnect socket
                disconnectSocket();
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
 * Create an account
 * @param  {any}                query    Create data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function postCreateUserData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.USER, {...query,
            password: translatePwd(query.password)
        }, 'POST')
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
        const sendData = {...query};
        if (sendData.password) {
            sendData.password = translatePwd(query.password);
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
 * @return {ActionThunkFunc} Thunk fuction
 */
export function queryUserOwnerData(): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.USER_SELF_PROFILE)
            .then((res) => {
                dispatch(updateUserOwner(res.data));
                dispatch(updateModel({
                    loading: false
                }));
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
 * @param  {string}          id User ID
 * @return {ActionThunkFunc}    Thunk fuction
 */
export function queryUserDetailData(id: string): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.USER_PROFILE, {
            id
        })
            .then((res) => {
                dispatch(updateUserDetail(res.data));
                dispatch(updateModel({
                    loading: false
                }));
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
 * @return {ActionThunkFunc} Thunk fuction
 */
export function queryUserListData(query: any): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingTable: true
        }));
        request(RequestAction.USER, query)
            .then((res) => {
                dispatch(updateUserList(res.data));
                dispatch(updateModel({
                    loadingTable: false
                }));
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

/**
 * Clean user owner info
 * @return {IActionData} Action
 */
export function cleanUserOwner(): IActionData {
    return {
        type: ActionType.CLEAN_USER_OWNER,
    };
}
