// Set user info: pack in "webpack.config.js" externals
// @ts-ignore: next
import * as user from 'user';

// Import action
import {IActionData, IContentData} from '../interfaces/redux';
import {ActionType} from '../types/redux';

import {pageSize} from '../lib/const';

// Todo, user model
const INIT_STATE: IContentData = {
    content: [],
    detail: {},
    page: 1,
    pageSize,
    total: 0,
};

export default function(state = Object.assign({}, INIT_STATE, {detail: user}), action: IActionData<IContentData>) {
    switch (action.type) {
    case ActionType.UPDATE_USER_DETAIL:
        const detail = Object.assign({}, action.data);
        return Object.assign({}, state, {
            detail
        });
    case ActionType.UPDATE_USER_LIST:
        if (!action.data) {
            return state;
        }
        const content = action.data.content.map((item, index) => {
            return Object.assign({
                key: index
            }, item);
        });
        return Object.assign({}, state, {
            content,
            page: action.data.page,
            pageSize: action.data.pageSize,
            total: action.data.total
        });
    case ActionType.CLEAN_USER_DETAIL:
        return Object.assign({}, state, {
            detail: {}
        });
    case ActionType.CLEAN_USER_LIST:
        return Object.assign({}, INIT_STATE);
    default:
        return state;
    }
}
