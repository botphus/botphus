import {ThunkAction} from 'redux-thunk';

import {IActionData, IReduxStoreState} from '../interfaces/redux';

/**
 * Redux Thunk func
 * @type {function}
 */
export type ActionThunkFunc = ThunkAction<void, IReduxStoreState, any, IActionData>;

/**
 * Redux callback function
 * @type {function}
 */
export type ActionCallbackFunc<T = any> = (res: T) => void;

/**
 * Redux action type
 */
export enum ActionType {
    'UPDATE_MODAL' = 'UPDATE_MODAL',
    'UPDATE_USER_LIST' = 'UPDATE_USER_LIST',
    'UPDATE_USER_DETAIL' = 'UPDATE_USER_DETAIL',
    'UPDATE_USER_OWNER' = 'UPDATE_USER_OWNER',
    'CLEAN_USER_LIST' = 'CLEAN_USER_LIST',
    'CLEAN_USER_DETAIL' = 'CLEAN_USER_DETAIL',
    'CLEAN_USER_OWNER' = 'CLEAN_USER_OWNER',
    'UPDATE_CONNECTION_LIST' = 'UPDATE_CONNECTION_LIST',
    'UPDATE_CONNECTION_DETAIL' = 'UPDATE_CONNECTION_DETAIL',
    'CLEAN_CONNECTION_LIST' = 'CLEAN_CONNECTION_LIST',
    'CLEAN_CONNECTION_DETAIL' = 'CLEAN_CONNECTION_DETAIL',
    'UPDATE_TASK_LIST' = 'UPDATE_TASK_LIST',
    'UPDATE_TASK_DETAIL' = 'UPDATE_TASK_DETAIL',
    'CLEAN_TASK_LIST' = 'CLEAN_TASK_LIST',
    'CLEAN_TASK_DETAIL' = 'CLEAN_TASK_DETAIL',
    'UPDATE_TASK_FLOW_LIST' = 'UPDATE_TASK_FLOW_LIST',
    'UPDATE_TASK_FLOW_DETAIL' = 'UPDATE_TASK_FLOW_DETAIL',
    'CLEAN_TASK_FLOW_LIST' = 'CLEAN_TASK_FLOW_LIST',
    'CLEAN_TASK_FLOW_DETAIL' = 'CLEAN_TASK_FLOW_DETAIL',
}
