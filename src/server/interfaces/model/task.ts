import {TaskRuleTypeItem} from 'botphus-core';
import {Document, Schema} from 'mongoose';

/**
 * Task model
 */
export interface ITaskModel extends Document {
    name: string; // Write first & Read only
    memebers: Schema.Types.ObjectId[];
    items: TaskRuleTypeItem[];
    createdUser: Schema.Types.ObjectId;
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
    memebers: Schema.Types.ObjectId[];
    items: TaskRuleTypeItem[];
}
