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
