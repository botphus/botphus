import {Schema, Types} from 'mongoose';

import {TaskStatus} from '../../types/task';

import {IModifyDateModel} from './';
import {IUserReferModel} from './user';

/**
 * Return data
 */
/**
 * Union task list item
 */
export interface IUnionTaskListItem {
    _id?: string;
    name?: string;
    createdAt?: string;
    updateAt?: string;
}

/**
 * Union task detail
 */
export interface IUnionTaskDetailItem extends IUnionTaskListItem {
    members?: IUserReferModel[];
    taskItems?: IUnionTaskClientSaveItem[];
    createdUser?: string;
    createdUserName?: string;
}

/**
 * Union task item base interface
 */
export interface IUnionTaskSaveItem {
    taskId: Schema.Types.ObjectId; // current ID
    name: string; // Task name
    startPage?: string; // Start page path
    ignoreError: boolean; // Ignore execution error
}

/**
 * Union task item base interface for client
 */
export interface IUnionTaskClientSaveItem {
    taskId: string; // current ID
    name: string; // Task name
    startPage?: string; // Start page path
    ignoreError: boolean; // Ignore execution error
}

/**
 * Union Task model
 */
export interface IUnionTaskModel extends IModifyDateModel {
    name: string;
    members: Schema.Types.ObjectId[];
    taskItems: IUnionTaskSaveItem[];
    createdUser: Types.ObjectId;
}

/**
 * Union Task user model
 */
export interface IUnionTaskUserModel extends IModifyDateModel {
    name: string;
    members?: IUserReferModel[];
    taskItems: IUnionTaskSaveItem[];
    createdUser: Schema.Types.ObjectId;
    createdUserName?: string;
}

/**
 * Search union task model
 */
export interface IUnionTaskSearchModel {
    name?: string;
    userId?: Schema.Types.ObjectId;
    status?: TaskStatus;
}

/**
 * Modify task model
 */
export interface IUnionTaskModifyModel {
    name: string;
    status?: TaskStatus;
    members: Schema.Types.ObjectId[];
    taskItems: IUnionTaskSaveItem[];
}
