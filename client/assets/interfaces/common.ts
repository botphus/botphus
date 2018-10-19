import { Dispatch } from 'react-redux';

import {ActionType} from '../types/action';

/**
 * Action data
 */
export interface IActionData<T = any> {
    type: ActionType;
    data?: T;
}

/**
 * Model data
 * @type {Object}
 */
export interface IModelData {
    loading: boolean;
    loadingForm: boolean;
    loadingPage: boolean;
    loadingTable: boolean;
    pageWarn: string;
}

export interface IReduxConnectProps {
    dispath: Dispatch<IActionData>;
}
