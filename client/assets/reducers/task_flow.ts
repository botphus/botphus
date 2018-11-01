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
        const curUpdateTaskFlowStatusDetail = {...state.detail};
        const curTaskFlowStatusReportMap = {...curUpdateTaskFlowStatusDetail.taskReportMap};
        if (action.data === TaskFlowStatus.ONGOING) {
            Object.keys(curTaskFlowStatusReportMap).forEach((key) => {
                if (curTaskFlowStatusReportMap[key].status === TaskReportStatus.FAILED || curTaskFlowStatusReportMap[key].status === TaskReportStatus.SUCCESS) {
                    curTaskFlowStatusReportMap[key].status = TaskReportStatus.PENDING;
                }
            });
            curUpdateTaskFlowStatusDetail.taskReportMap = curTaskFlowStatusReportMap;
        }
        return {
            ...state,
            detail: curUpdateTaskFlowStatusDetail,
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
