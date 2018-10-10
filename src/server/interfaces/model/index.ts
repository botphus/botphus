import {Document} from 'mongoose';

/**
 * Base model
 */
export interface IModifyDateModel extends Document {
    createdAt: Date;
    updateAt: Date;
}

export * from './user';
export * from './database';
export * from './task';
export * from './task_flow';
export * from './task_report';
