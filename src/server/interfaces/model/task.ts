import {Schema, Types} from 'mongoose';

import {TaskPageType, TaskStatus, TaskSubType, TaskType} from '../../types/task';

import {IModifyDateModel} from './';
import {IUserReferModel} from './user';
import {IUserGroupReferModel} from './user_group';

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
    createdUser?: string;
    createdAt?: string;
    updateAt?: string;
}

/**
 * Task detail
 */
export interface ITaskDetailItem extends ITaskListItem {
    members?: IUserReferModel[];
    userGroups?: IUserGroupReferModel[];
    ruleItems?: ITaskRuleSaveItem[];
    createdUserName?: string;
}

/**
 * Task item base interface
 */
export interface ITaskRuleSaveItem {
    index?: string;
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
    name: string;
    pageType: TaskPageType;
    members: Schema.Types.ObjectId[];
    userGroups?: Schema.Types.ObjectId[];
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
    userGroups?: IUserGroupReferModel[];
    ruleItems: ITaskRuleSaveItem[];
    createdUser: Schema.Types.ObjectId;
    createdUserName?: string;
}

/**
 * Search task model
 */
export interface ITaskSearchModel {
    name?: string;
    pageType?: TaskPageType;
    userId?: Schema.Types.ObjectId;
    userGroups?: Schema.Types.ObjectId[];
    status?: TaskStatus;
}

/**
 * Modify task model
 */
export interface ITaskModifyModel {
    name?: string;
    status?: TaskStatus;
    pageType?: TaskPageType;
    members?: Schema.Types.ObjectId[];
    userGroups?: Schema.Types.ObjectId[];
    ruleItems?: ITaskRuleSaveItem[];
}
