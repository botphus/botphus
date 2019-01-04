import {Document} from 'mongoose';

/**
 * Base model
 */
export interface IModifyDateModel extends Document {
    createdAt: Date;
    updateAt: Date;
}

export * from './user';
export * from './user_group';
export * from './connection';
export * from './task';
export * from './task_flow';
export * from './task_report';
export * from './union_task';
export * from './union_task_flow';
