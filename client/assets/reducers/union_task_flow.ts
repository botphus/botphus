// Import action
import {IActionData, IUnionTaskFlowContentData} from '../interfaces/redux';
import {ActionType} from '../types/redux';

import {pageSize} from '../lib/const';

const INIT_STATE: IUnionTaskFlowContentData = {
    content: [],
    detail: {},
    page: 1,
    pageSize,
    total: 0,
};

export default function(state = INIT_STATE, action: IActionData<any>) {
    switch (action.type) {
    case ActionType.UPDATE_UNION_TASK_FLOW_DETAIL:
        const detail = {...action.data};
        return {
            ...state,
            detail
        };
    case ActionType.UPDATE_UNION_TASK_FLOW_LIST:
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
        const curUpdateUnionTaskFlowReportMapDetail = {...state.detail};
        const curUpdateUnionTaskFlowReportMapReportMap = {...curUpdateUnionTaskFlowReportMapDetail.taskReportMap};
        curUpdateUnionTaskFlowReportMapReportMap[curReport.index] = {...curUpdateUnionTaskFlowReportMapReportMap[curReport.index], ...curReport};
        curUpdateUnionTaskFlowReportMapDetail.taskReportMap = curUpdateUnionTaskFlowReportMapReportMap;
        return {
            ...state,
            detail: curUpdateUnionTaskFlowReportMapDetail
        };
        break;
    case ActionType.UPDATE_TASK_FlOW_STATUS:
        const curUpdateUnionTaskFlowStatusDetail = {
            ...state.detail,
            status: action.data
        };
        return {
            ...state,
            detail: curUpdateUnionTaskFlowStatusDetail
        };
        break;
    case ActionType.CLEAN_UNION_TASK_FLOW_DETAIL:
        return {
            ...state,
            detail: {}
        };
    case ActionType.CLEAN_UNION_TASK_FLOW_LIST:
        return {...INIT_STATE};
    default:
        return state;
    }
}
