import {message} from 'antd';

import {IActionData} from '../interfaces/redux';
import {ActionCallbackFunc, ActionThunkFunc, ActionType} from '../types/redux';
import {RequestAction} from '../types/request';

import {updateModel} from './modal';

import request from '../lib/request';

// actions
/**
 * Create connection
 * @param  {any}                query    Create data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function createConnectionData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.CONNECTION, query, 'POST')
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
 * Update connection
 * @param  {any}                query    Connection data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function modifyConnectionData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.CONNECTION, query, 'PATCH')
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
 * Query connection detail data
 * @param  {string}          id Connection ID
 * @return {ActionThunkFunc}    Thunk fuction
 */
export function queryConnectionDetailData(id: string): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.CONNECTION_PROFILE, {
            id
        })
            .then((res) => {
                dispatch(updateConnectionDetail(res.data));
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
 * Query connection list data
 * @return {ActionThunkFunc} Thunk fuction
 */
export function queryConnectionListData(query: any): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingTable: true
        }));
        request(RequestAction.CONNECTION, query)
            .then((res) => {
                dispatch(updateConnectionList(res.data));
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
 * Update connection list
 * @param  {any}         data Update data
 * @return {IActionData}      Action
 */
export function updateConnectionList(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_CONNECTION_LIST,
    };
}

/**
 * Clean connection list
 * @return {IActionData} Action
 */
export function cleanConnectionList(): IActionData {
    return {
        type: ActionType.CLEAN_CONNECTION_LIST
    };
}

/**
 * Update connection detail
 * @param  {Any}         data Update data
 * @return {IActionData}      Action
 */
export function updateConnectionDetail(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_CONNECTION_DETAIL,
    };
}

/**
 * Clean connection detail
 * @return {IActionData} Action
 */
export function cleanConnectionDetail(): IActionData {
    return {
        type: ActionType.CLEAN_CONNECTION_DETAIL
    };
}
