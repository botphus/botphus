import {message} from 'antd';

import {IActionData} from '../interfaces/redux';
import {ActionCallbackFunc, ActionThunkFunc, ActionType} from '../types/redux';
import {RequestAction} from '../types/request';

import {updateModel} from './modal';

import request from '../lib/request';

// actions
/**
 * Create union task
 * @param  {any}                query    Create data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function createUnionTaskData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.UNION_TASK, query, 'POST')
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
 * Update union task
 * @param  {any}                query    Union task data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function modifyUnionTaskData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.UNION_TASK, query, 'PATCH')
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
 * Query union task detail data
 * @param  {string}          id Union task ID
 * @return {ActionThunkFunc}    Thunk fuction
 */
export function queryUnionTaskDetailData(id: string): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.UNION_TASK_PROFILE, {
            id
        })
            .then((res) => {
                dispatch(updateUnionTaskDetail(res.data));
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
 * Query union task list data
 * @return {ActionThunkFunc} Thunk fuction
 */
export function queryUnionTaskListData(query: any): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingTable: true
        }));
        request(RequestAction.UNION_TASK, query)
            .then((res) => {
                dispatch(updateUnionTaskList(res.data));
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
 * Update union task list
 * @param  {any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUnionTaskList(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_UNION_TASK_LIST,
    };
}

/**
 * Clean union task list
 * @return {IActionData} Action
 */
export function cleanUnionTaskList(): IActionData {
    return {
        type: ActionType.CLEAN_UNION_TASK_LIST
    };
}

/**
 * Update union task detail
 * @param  {Any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUnionTaskDetail(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_UNION_TASK_DETAIL,
    };
}

/**
 * Clean union task detail
 * @return {IActionData} Action
 */
export function cleanUnionTaskDetail(): IActionData {
    return {
        type: ActionType.CLEAN_UNION_TASK_DETAIL
    };
}
