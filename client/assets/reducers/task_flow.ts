// Import action
import {IActionData, ITaskFlowContentData} from '../interfaces/redux';
import {ActionType} from '../types/redux';

import {pageSize} from '../lib/const';

const INIT_STATE: ITaskFlowContentData = {
    content: [],
    detail: {},
    page: 1,
    pageSize,
    total: 0,
};

export default function(state = INIT_STATE, action: IActionData<any>) {
    switch (action.type) {
    case ActionType.UPDATE_TASK_FLOW_DETAIL:
        const detail = {...action.data};
        return {
            ...state,
            detail
        };
    case ActionType.UPDATE_TASK_FLOW_LIST:
        if (!action.data) {
            return state;
        }
        const content = action.data.content.map((item, index) => {
            return {
                key: index,
                ...item
            };
        });
        return {
            ...state,
            content,
            page: action.data.page,
            pageSize: action.data.pageSize,
            total: action.data.total
        };
    case ActionType.UPDATE_TASK_FlOW_REPORT_MAP:
        if (!(state.detail.taskReportMap)) {
            return state;
        }
        const curReport: any = {...action.data};
        if (!curReport.index) {
            return state;
        }
        const curUpdateTaskFlowReportMapDetail = {...state.detail};
        const curUpdateTaskFlowReportMapReportMap = {...curUpdateTaskFlowReportMapDetail.taskReportMap};
        curUpdateTaskFlowReportMapReportMap[curReport.index] = {...curUpdateTaskFlowReportMapReportMap[curReport.index], ...curReport};
        curUpdateTaskFlowReportMapDetail.taskReportMap = curUpdateTaskFlowReportMapReportMap;
        return {
            ...state,
            detail: curUpdateTaskFlowReportMapDetail
        };
        break;
    case ActionType.UPDATE_TASK_FlOW_STATUS:
        const curUpdateTaskFlowStatusDetail = {
            ...state.detail,
            status: action.data
        };
        return {
            ...state,
            detail: curUpdateTaskFlowStatusDetail
        };
        break;
    case ActionType.CLEAN_TASK_FLOW_DETAIL:
        return {
            ...state,
            detail: {}
        };
    case ActionType.CLEAN_TASK_FLOW_LIST:
        return {...INIT_STATE};
    default:
        return state;
    }
}
