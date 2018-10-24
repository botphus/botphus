import {ThunkDispatch} from 'redux-thunk';

import {IConnectionDetailItem, IConnectionListItem} from '../../../src/server/interfaces/model/connection';
import {IUserDetailItem, IUserListItem, IUserSession} from '../../../src/server/interfaces/model/user';
import {ActionType} from '../types/redux';

/**
 * Action data
 * - T = data interface
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
 * - L = list item interface
 * - D = detail item interface
 */
export interface IContentData<L = any, D = any> {
    content: L[];
    detail: D;
    page: number;
    pageSize: number;
    total: number;
}

/**
 * User content data
 */
export interface IUserContentData extends IContentData<IUserListItem, IUserDetailItem> {
    owner: IUserSession;
}

export type IConnectionContentData = IContentData<IConnectionListItem, IConnectionDetailItem>;

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
    connection: IConnectionContentData;
    modal: IModalData;
    user: IUserContentData;
}

/**
 * Detail page's match route component props for withRouter function is exported by "react-router-dom"
 */
export interface IDetailPageRouteMatchProps {
    id: string; // Detail page ID
}
