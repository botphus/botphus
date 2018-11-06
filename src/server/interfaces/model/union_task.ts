import {Schema, Types} from 'mongoose';

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
    taskItems?: IUnionTaskSaveItem[];
    createdUser?: string;
    createdUserName?: string;
}

/**
 * Union task item base interface
 */
export interface IUnionTaskSaveItem {
    taskId: Schema.Types.ObjectId; // current ID
    taskPid?: Schema.Types.ObjectId; // parent ID
    name: string; // Task name
    level: string; // Tree level
    startPage?: string; // Start page path
    ignoreError: boolean; // Ignore execution error
}

export interface IUnionTaskTreeItem extends IUnionTaskSaveItem {
    children: IUnionTaskTreeItem[];
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
}

/**
 * Modify task model
 */
export interface IUnionTaskModifyModel {
    name: string;
    members: Schema.Types.ObjectId[];
    taskItems: IUnionTaskSaveItem[];
}
