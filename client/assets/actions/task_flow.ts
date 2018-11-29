import {message} from 'antd';

import {IActionData} from '../interfaces/redux';
import {ITaskReportDetailItem} from '../interfaces/task';
import {TaskFlowStatus} from '../types/common';
import {ActionCallbackFunc, ActionThunkFunc, ActionType} from '../types/redux';
import {RequestAction} from '../types/request';

import {updateModel} from './modal';

import request from '../lib/request';

// actions
/**
 * Create task flow
 * @param  {any}                query    Create data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function createTaskFlowData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.TASK_FLOW, query, 'POST')
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
 * Start task flow
 * @param  {string}             taskFlowId Task flow ID
 * @param  {ActionCallbackFunc} callback   Callback function
 * @return {ActionThunkFunc}               Thunk fuction
 */
export function startTaskFlowData(taskFlowId: string, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.TASK_FLOW_START, {
            id: taskFlowId
        })
            .then((res) => {
                dispatch(updateModel({
                    loading: false
                }));
                dispatch(queryTaskFlowDetailData(taskFlowId));
                dispatch(updateTaskFlowStatus(TaskFlowStatus.ONGOING));
                message.success(res.message);
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
 * Query task flow detail data
 * @param  {string}          id TaskFlow ID
 * @return {ActionThunkFunc}    Thunk fuction
 */
export function queryTaskFlowDetailData(id: string): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.TASK_FLOW_PROFILE, {
            id
        })
            .then((res) => {
                dispatch(updateTaskFlowDetail(res.data));
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
 * Query task flow list data
 * @return {ActionThunkFunc} Thunk fuction
 */
export function queryTaskFlowListData(query: any): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingTable: true
        }));
        request(RequestAction.TASK_FLOW, query)
            .then((res) => {
                dispatch(updateTaskFlowList(res.data));
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
 * Update task flow list
 * @param  {any}         data Update data
 * @return {IActionData}      Action
 */
export function updateTaskFlowList(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_TASK_FLOW_LIST,
    };
}

/**
 * Clean task flow list
 * @return {IActionData} Action
 */
export function cleanTaskFlowList(): IActionData {
    return {
        type: ActionType.CLEAN_TASK_FLOW_LIST
    };
}

/**
 * Update task flow detail
 * @param  {Any}         data Update data
 * @return {IActionData}      Action
 */
export function updateTaskFlowDetail(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_TASK_FLOW_DETAIL,
    };
}

/**
 * Update task flow report map
 * @param  {[type]}      reportData Report data
 * @return {IActionData}            Action
 */
export function updateTaskFlowReportMap(reportData: ITaskReportDetailItem): IActionData {
    return {
        data: reportData,
        type: ActionType.UPDATE_TASK_FlOW_REPORT_MAP
    };
}

/**
 * Update task flow status
 * @param  {TaskFlowStatus} status Flow status
 * @return {IActionData}           Action
 */
export function updateTaskFlowStatus(status: TaskFlowStatus): IActionData {
    return {
        data: status,
        type: ActionType.UPDATE_TASK_FlOW_STATUS
    };
}

/**
 * Clean task flow detail
 * @return {IActionData} Action
 */
export function cleanTaskFlowDetail(): IActionData {
    return {
        type: ActionType.CLEAN_TASK_FLOW_DETAIL
    };
}
