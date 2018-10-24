import {ThunkDispatch} from 'redux-thunk';

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
 * User content data
 */
export interface IUserContentData extends IContentData {
    owner: any;
}

/**
 * Redux connect props
 */
export interface IReduxConnectProps {
    dispatch: ThunkDispatch<IReduxStoreState, any, IActionData>;
}

/**
 * Redux Store
 */
export interface IReduxStoreState {
    modal: IModalData;
    user: IContentData;
}

/**
 * Detail page's match route component props for withRouter function is exported by "react-router-dom"
 */
export interface IDetailPageRouteMatchProps {
    id: string; // Detail page ID
}
