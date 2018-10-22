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
export function updateCostRecordDetail(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_USER_DETAIL,
    };
}

/**
 * Clean user detail
 * @return {IActionData} Action
 */
export function cleanCostRecordDetail(): IActionData {
    return {
        type: ActionType.CLEAN_USER_DETAIL
    };
}
