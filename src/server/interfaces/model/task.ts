import {ITaskDataRuleItem, ITaskDomRuleItem, ITaskEventRuleItem, ITaskPageRuleItem, ITaskTimeRuleItem} from 'botphus-core';
import {Document, Schema, Types} from 'mongoose';

import {TaskPageType, TaskSaveRuleTypeItem} from '../../types/task';
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
    updateAt?: number;
}

/**
 * Task detail
 */
export interface ITaskDetailItem extends ITaskListItem {
    members?: IUserReferModel[];
    ruleItems?: TaskSaveRuleTypeItem[];
    createdUser?: string;
    createdUserName?: string;
}

/**
 * Task item base interface
 */
interface ItaskSaveBaseItem {
    name: string;
    children?: TaskSaveRuleTypeItem[];
}

/**
 * Rewrite all rul item with base interface
 */
/**
 * Rewrite data rule
 */
export interface ITaskSaveDataRuleItem extends ITaskDataRuleItem, ItaskSaveBaseItem {}
/**
 * Rewrite DOM rule
 */
export interface ITaskSaveDomRuleItem extends ITaskDomRuleItem, ItaskSaveBaseItem {}
/**
 * Rewrite event rule
 */
export interface ITaskSaveEventRuleItem extends ITaskEventRuleItem, ItaskSaveBaseItem {
   children: TaskSaveRuleTypeItem[];
}
/**
 * Rewrite page rule
 */
export interface ITaskSavePageRuleItem extends ITaskPageRuleItem, ItaskSaveBaseItem {}
/**
 * Rewrite time rule
 */
export interface ITaskSaveTimeRuleItem extends ITaskTimeRuleItem, ItaskSaveBaseItem {}

/**
 * Task model
 */
export interface ITaskModel extends Document {
    name: string; // Write first & Read only
    pageType: TaskPageType;
    members: Schema.Types.ObjectId[];
    ruleItems: TaskSaveRuleTypeItem[];
    createdUser: Types.ObjectId;
}

/**
 * Task user model
 */
export interface ITaskUserModel {
    name: string;
    pageType: TaskPageType;
    members?: IUserReferModel[];
    ruleItems: TaskSaveRuleTypeItem[];
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
    ruleItems: TaskSaveRuleTypeItem[];
}
