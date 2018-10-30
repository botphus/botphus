import {Document, Schema, Types} from 'mongoose';

import {TaskPageType, TaskSubType, TaskType} from '../../types/task';
import {IModifyDateModel} from './';

import {IUserReferModel} from './user';

/**
 * Return data
 */
/**
 * Task list item
 */
export interface ITaskListItem {
    _id?: string;
    name?: string;
    pageType?: TaskPageType;
    createdAt?: string;
    updateAt?: string;
}

/**
 * Task detail
 */
export interface ITaskDetailItem extends ITaskListItem {
    members?: IUserReferModel[];
    ruleItems?: ITaskRuleSaveItem[];
    createdUser?: string;
    createdUserName?: string;
}

/**
 * Task item base interface
 */
export interface ITaskRuleSaveItem {
    id: number; // current ID
    pid: number; // parent ID
    level: number; // Tree level
    type: TaskType; // Type
    subType: TaskSubType; // subType
    arguments?: any[]; // Rule arguments
    assertion?: string[]; // Assertion list
    assertionVarName?: string; // Assertion variable name
    name: string; // Rule name
}

export interface ITaskRuleTreeItem extends ITaskRuleSaveItem {
    index: string;
    children: ITaskRuleTreeItem[];
}

/**
 * Task model
 */
export interface ITaskModel extends IModifyDateModel {
    name: string; // Write first & Read only
    pageType: TaskPageType;
    members: Schema.Types.ObjectId[];
    ruleItems: ITaskRuleSaveItem[];
    createdUser: Types.ObjectId;
}

/**
 * Task user model
 */
export interface ITaskUserModel extends IModifyDateModel {
    name: string;
    pageType: TaskPageType;
    members?: IUserReferModel[];
    ruleItems: ITaskRuleSaveItem[];
    createdUser: Schema.Types.ObjectId;
    createdUserName?: string;
}

/**
 * Search task model
 */
export interface ITaskSearchModel extends Document {
    name?: string;
    pageType: TaskPageType;
    userId?: Schema.Types.ObjectId;
}

/**
 * Modify task model
 */
export interface ITaskModifyModel extends Document {
    pageType: TaskPageType;
    members: Schema.Types.ObjectId[];
    ruleItems: ITaskRuleSaveItem[];
}
