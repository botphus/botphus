import { Dispatch } from 'react-redux';

import {ActionType} from '../types/redux';

/**
 * Action data
 */
export interface IActionData<T = any> {
    type: ActionType;
    data?: T;
}

/**
 * Modal data
 * @type {Object}
 */
export interface IModalData {
    loading: boolean;
    loadingForm: boolean;
    loadingPage: boolean;
    loadingTable: boolean;
    pageWarn: string;
}

/**
 * Modal update data
 */
export interface IModalUpdateData {
    loading?: boolean;
    loadingForm?: boolean;
    loadingPage?: boolean;
    loadingTable?: boolean;
    pageWarn?: string;
}

/**
 * Content data
 */
export interface IContentData<T = any> {
    content: T[];
    detail: T;
    page: number;
    pageSize: number;
    total: number;
}

/**
 * Redux connect props
 */
export interface IReduxConnectProps {
    dispatch: Dispatch<IActionData>;
}

/**
 * Redux Store
 */
export interface IReduxStoreState {
    modal: IModalData;
    user: IContentData;
}
