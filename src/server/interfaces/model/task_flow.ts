import {ITaskExcludeUnit} from 'botphus-core';
import {Schema, Types} from 'mongoose';

import {IModifyDateModel} from './';

import {IIndexMap} from '../common';
import {IConnectionDetailMysqlItem, IConnectionDetailRedisItem, IMysqlConnectionModel, IRedisConnectionModel} from './connection';
import {ITaskDetailItem, ITaskModel} from './task';
import {ITaskReportDetailItem, ITaskReportModel} from './task_report';

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
    mysqlDetail?: IConnectionDetailMysqlItem;
    redisId?: Schema.Types.ObjectId;
    redisDetail?: IConnectionDetailRedisItem;
    taskId?: Schema.Types.ObjectId;
    taskDetail?: ITaskDetailItem;
    taskReportMap?: IIndexMap<ITaskReportDetailItem>;
}

/**
 * Task execution flow model
 */
export interface ITaskFlowModel extends IModifyDateModel {
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
 * Task execution flow detail model
 */
export interface ITaskFlowDetailModel extends ITaskFlowModel {
    mysqlDetail?: IMysqlConnectionModel;
    redisDetail?: IRedisConnectionModel;
    taskDetail?: ITaskModel;
    taskReportMap?: IIndexMap<ITaskReportModel>;
}

/**
 * Task execution flow serach model
 */
export interface ITaskFlowSearchModel {
    name: string;
    createdUser?: Types.ObjectId;
}
