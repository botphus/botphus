import {ITaskExcludeUnit} from 'botphus-core';
import {Document, Schema, Types} from 'mongoose';

import {IIndexMap} from '../common';
import {IConnectionDetailItem, IConnectionModel} from './connection';
import {ITaskDetailItem, ITaskModel} from './task';
import {ITaskReportBaseItem, ITaskReportModel} from './task_report';

/**
 * Return data
 */
/**
 * Task flow list item
 */
export interface ITaskFlowListItem {
    _id?: string;
    name?: string;
    taskId?: Schema.Types.ObjectId;
    taskName?: string;
    createdAt?: string;
    updateAt?: number;
}

/**
 * Task detail
 */
export interface ITaskFlowDetailItem extends ITaskFlowListItem {
    startPage?: string;
    mysqlId?: Schema.Types.ObjectId;
    mysqlDetail?: IConnectionDetailItem;
    redisId?: Schema.Types.ObjectId;
    redisDetail?: IConnectionDetailItem;
    taskId?: Schema.Types.ObjectId;
    taskDetail?: ITaskDetailItem;
    taskReportMap?: IIndexMap<ITaskReportBaseItem>;
}

/**
 * Task execution flow model
 */
export interface ITaskFlowModel extends Document {
    name: string;
    startPage?: string;
    // mysql config id
    mysqlId?: Schema.Types.ObjectId;
    // redis config id
    redisId?: Schema.Types.ObjectId;
    excludeOption: ITaskExcludeUnit;
    taskId: Schema.Types.ObjectId;
    createdUser: Types.ObjectId;
}

/**
 * Task execution flow serach model
 */
export interface ITaskFlowSearchModel extends Document {
    name: string;
    createdUser?: Types.ObjectId;
}

/**
 * Task execution flow detail model
 */
export interface ITaskFlowDetailModel extends ITaskFlowModel {
    mysqlDetail?: IConnectionModel;
    redisDetail?: IConnectionModel;
    taskDetail?: ITaskModel;
    taskReportMap?: IIndexMap<ITaskReportModel>;
}
