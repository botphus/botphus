import {message} from 'antd';

import {IActionData} from '../interfaces/redux';
import {ActionCallbackFunc, ActionThunkFunc, ActionType} from '../types/redux';
import {RequestAction} from '../types/request';

import {updateModel} from './modal';

import request from '../lib/request';

// actions
/**
 * Create user group
 * @param  {any}                query    Create data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function createUserGroupData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.USER_GROUP, query, 'POST')
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
 * Update user group
 * @param  {any}                query    Union task data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function modifyUserGroupData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.USER_GROUP, query, 'PATCH')
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
 * Query user group detail data
 * @param  {string}          id Union task ID
 * @return {ActionThunkFunc}    Thunk fuction
 */
export function queryUserGroupDetailData(id: string): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.USER_GROUP_PROFILE, {
            id
        })
            .then((res) => {
                dispatch(updateUserGroupDetail(res.data));
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
 * Query user group list data
 * @return {ActionThunkFunc} Thunk fuction
 */
export function queryUserGroupListData(query: any): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingTable: true
        }));
        request(RequestAction.USER_GROUP, query)
            .then((res) => {
                dispatch(updateUserGroupList(res.data));
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
 * Update user group list
 * @param  {any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUserGroupList(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_USER_GROUP_LIST,
    };
}

/**
 * Clean user group list
 * @return {IActionData} Action
 */
export function cleanUserGroupList(): IActionData {
    return {
        type: ActionType.CLEAN_USER_GROUP_LIST
    };
}

/**
 * Update user group detail
 * @param  {Any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUserGroupDetail(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_USER_GROUP_DETAIL,
    };
}

/**
 * Clean user group detail
 * @return {IActionData} Action
 */
export function cleanUserGroupDetail(): IActionData {
    return {
        type: ActionType.CLEAN_USER_GROUP_DETAIL
    };
}
