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
 * Create union task flow
 * @param  {any}                query    Create data
 * @param  {ActionCallbackFunc} callback Callback function
 * @return {ActionThunkFunc}             Thunk fuction
 */
export function createUnionTaskFlowData(query: any, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingForm: true
        }));
        request(RequestAction.UNION_TASK_FLOW, query, 'POST')
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
 * Start union task flow
 * @param  {string}             taskFlowId Union task flow ID
 * @param  {ActionCallbackFunc} callback   Callback function
 * @return {ActionThunkFunc}               Thunk fuction
 */
export function startUnionTaskFlowData(taskFlowId: string, callback?: ActionCallbackFunc): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.UNION_TASK_FLOW_START, {
            id: taskFlowId
        })
            .then((res) => {
                dispatch(updateModel({
                    loading: false
                }));
                dispatch(queryUnionTaskFlowDetailData(taskFlowId));
                dispatch(updateUnionTaskFlowStatus(TaskFlowStatus.ONGOING));
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
 * Query union task flow detail data
 * @param  {string}          id Union task flow ID
 * @return {ActionThunkFunc}    Thunk fuction
 */
export function queryUnionTaskFlowDetailData(id: string): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loading: true
        }));
        request(RequestAction.UNION_TASK_FLOW_PROFILE, {
            id
        })
            .then((res) => {
                dispatch(updateUnionTaskFlowDetail(res.data));
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
 * Query union task flow list data
 * @return {ActionThunkFunc} Thunk fuction
 */
export function queryUnionTaskFlowListData(query: any): ActionThunkFunc {
    return (dispatch) => {
        dispatch(updateModel({
            loadingTable: true
        }));
        request(RequestAction.UNION_TASK_FLOW, query)
            .then((res) => {
                dispatch(updateUnionTaskFlowList(res.data));
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
 * Update union task flow list
 * @param  {any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUnionTaskFlowList(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_UNION_TASK_FLOW_LIST,
    };
}

/**
 * Clean union task flow list
 * @return {IActionData} Action
 */
export function cleanUnionTaskFlowList(): IActionData {
    return {
        type: ActionType.CLEAN_UNION_TASK_FLOW_LIST
    };
}

/**
 * Update union task flow detail
 * @param  {Any}         data Update data
 * @return {IActionData}      Action
 */
export function updateUnionTaskFlowDetail(data: any): IActionData {
    return {
        data,
        type: ActionType.UPDATE_UNION_TASK_FLOW_DETAIL,
    };
}

/**
 * Update union task flow report map
 * @param  {[type]}      reportData Report data
 * @return {IActionData}            Action
 */
export function updateUnionTaskFlowReportMap(reportData: ITaskReportDetailItem): IActionData {
    return {
        data: reportData,
        type: ActionType.UPDATE_TASK_FlOW_REPORT_MAP
    };
}

/**
 * Update union task flow status
 * @param  {TaskFlowStatus} status Flow status
 * @return {IActionData}           Action
 */
export function updateUnionTaskFlowStatus(status: TaskFlowStatus): IActionData {
    return {
        data: status,
        type: ActionType.UPDATE_TASK_FlOW_STATUS
    };
}

/**
 * Clean union task flow detail
 * @return {IActionData} Action
 */
export function cleanUnionTaskFlowDetail(): IActionData {
    return {
        type: ActionType.CLEAN_UNION_TASK_FLOW_DETAIL
    };
}
