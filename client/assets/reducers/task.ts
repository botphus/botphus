// Import action
import {IActionData, ITaskContentData} from '../interfaces/redux';
import {ActionType} from '../types/redux';

import {pageSize} from '../lib/const';

const INIT_STATE: ITaskContentData = {
    content: [],
    detail: {},
    page: 1,
    pageSize,
    total: 0,
};

export default function(state = INIT_STATE, action: IActionData<any>) {
    switch (action.type) {
    case ActionType.UPDATE_TASK_DETAIL:
        const detail = {...action.data};
        return {
            ...state,
            detail
        };
    case ActionType.UPDATE_TASK_LIST:
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
    case ActionType.CLEAN_TASK_DETAIL:
        return {
            ...state,
            detail: {}
        };
    case ActionType.CLEAN_TASK_LIST:
        return {...INIT_STATE};
    default:
        return state;
    }
}
