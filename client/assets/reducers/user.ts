// Set user info: pack in "webpack.config.js" externals
// @ts-ignore: next
import * as user from 'user';

// If user info init, connect socket
import {connectSocket} from '../lib/socket';

if (user.id) {
    connectSocket();
}

// Import action
import {IActionData, IUserContentData} from '../interfaces/redux';
import {ActionType} from '../types/redux';

import {pageSize} from '../lib/const';

const INIT_STATE: IUserContentData = {
    content: [],
    detail: {},
    owner: {},
    page: 1,
    pageSize,
    total: 0,
};

export default function(state = {...INIT_STATE, owner: user}, action: IActionData<any>) {
    switch (action.type) {
    case ActionType.UPDATE_USER_DETAIL:
        const detail = {...action.data};
        return {
            ...state,
            detail
        };
    case ActionType.UPDATE_USER_OWNER:
        const owner = {...action.data};
        return {
            ...state,
            owner
        };
    case ActionType.UPDATE_USER_LIST:
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
    case ActionType.CLEAN_USER_DETAIL:
        return {
            ...state,
            detail: {}
        };
    case ActionType.CLEAN_USER_OWNER:
        return {
            ...state,
            owner: {}
        };
    case ActionType.CLEAN_USER_LIST:
        return {
            ...INIT_STATE,
            owner: state.owner
        };
    default:
        return state;
    }
}
