import {message} from 'antd';

import {IActionData} from '../interfaces/redux';
import {ActionCallbackFunc, ActionThunkFunc, ActionType} from '../types/redux';
import {RequestAction} from '../types/request';

import {updateModel} from './modal';

import request from '../lib/request';

// actions
/**
 * Create task
 * @param  {any}                query    Create data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function createTaskData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.TASK, query, 'POST')
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
 * Update task
 * @param  {any}                query    Task data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function modifyTaskData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.TASK, query, 'PATCH')
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
 * Query task detail data
 * @param  {string}          id Task ID
 * @return {ActionThunkFunc}    Thunk fuction
 */
export function queryTaskDetailData(id: string): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.TASK_PROFILE, {
            id
        })
            .then((res) => {
                dispatch(updateTaskDetail(res.data));
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
 * Query task list data
 * @return {ActionThunkFunc} Thunk fuction
 */
export function queryTaskListData(query: any): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingTable: true
        }));
        request(RequestAction.TASK, query)
            .then((res) => {
                dispatch(updateTaskList(res.data));
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
 * Update task list
 * @param  {any}         data Update data
 * @return {IActionData}      Action
 */
export function updateTaskList(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_TASK_LIST,
    };
}

/**
 * Clean task list
 * @return {IActionData} Action
 */
export function cleanTaskList(): IActionData {
    return {
        type: ActionType.CLEAN_TASK_LIST
    };
}

/**
 * Update task detail
 * @param  {Any}         data Update data
 * @return {IActionData}      Action
 */
export function updateTaskDetail(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_TASK_DETAIL,
    };
}

/**
 * Clean task detail
 * @return {IActionData} Action
 */
export function cleanTaskDetail(): IActionData {
    return {
        type: ActionType.CLEAN_TASK_DETAIL
    };
}
