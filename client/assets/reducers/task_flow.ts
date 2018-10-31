// Import action
import {IActionData, ITaskFlowContentData} from '../interfaces/redux';
import {TaskFlowStatus, TaskReportStatus} from '../types/common';
import {ActionType} from '../types/redux';

import {pageSize} from '../lib/const';

const INIT_STATE: ITaskFlowContentData = {
    content: [],
    detail: {},
    flowStatus: TaskFlowStatus.CLOSE,
    page: 1,
    pageSize,
    total: 0,
};

export default function(state = INIT_STATE, action: IActionData<any>) {
    switch (action.type) {
    case ActionType.UPDATE_TASK_FLOW_DETAIL:
        const detail = {...action.data};
        // Check update date
        let flowStatus = (detail.taskDetail && new Date(detail.createdAt) > new Date(detail.taskDetail.updateAt)) ?
            TaskFlowStatus.SUCCESS : TaskFlowStatus.CLOSE;
        // Check task report ongoing status
        if (flowStatus !== TaskFlowStatus.CLOSE) {
            Object.keys(detail.taskReportMap).some((key) => {
                const curStatus = detail.taskReportMap[key].status;
                switch (curStatus) {
                    case TaskReportStatus.ONGOING:
                        flowStatus = TaskFlowStatus.ONGOING;
                        break;
                    case TaskReportStatus.FAILED:
                        flowStatus = TaskFlowStatus.FAILED;
                        break;
                    case TaskReportStatus.PENDING:
                        flowStatus = TaskFlowStatus.PENDING;
                    default:
                        return false;
                }
                return true;
            });
        }
        return {
            ...state,
            detail,
            flowStatus
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
        const curDetail = {...state.detail};
        const curReportMap = {...curDetail.taskReportMap};
        curReportMap[curReport.index] = {...curReportMap[curReport.index], ...curReport};
        curDetail.taskReportMap = curReportMap;
        return {
            ...state,
            detail: curDetail
        };
        break;
    case ActionType.UPDATE_TASK_FlOW_STATUS:
        return {
            ...state,
            flowStatus: action.data
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
