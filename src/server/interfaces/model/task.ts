import {ITaskDataRuleItem, ITaskDomRuleItem, ITaskEventRuleItem, ITaskPageRuleItem, ITaskTimeRuleItem} from 'botphus-core';
import {Document, Schema, Types} from 'mongoose';

import {TaskSaveRuleTypeItem} from '../../types/task';
import {IUserReferModel} from './user';

/**
 * Task item base interface
 */
interface ItaskSaveBaseItem {
    name: string;
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
    members: Schema.Types.ObjectId[];
    ruleItems: TaskSaveRuleTypeItem[];
    createdUser: Types.ObjectId;
}

/**
 * Task user model
 */
export interface ITaskUserModel {
    name: string;
    members?: IUserReferModel[];
    ruleItems: TaskSaveRuleTypeItem[];
    createdUser: Types.ObjectId;
}

/**
 * Search task model
 */
export interface ITaskSearchModel extends Document {
    name?: string;
    userId?: Schema.Types.ObjectId;
}

/**
 * Modify task model
 */
export interface ITaskModifyModel extends Document {
    members: Schema.Types.ObjectId[];
    ruleItems: TaskSaveRuleTypeItem[];
}
