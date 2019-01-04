import {Schema, Types} from 'mongoose';

import {TaskFlowStatus} from '../../types/task';
import {IModifyDateModel} from './';

import {IIndexMap} from '../common';
import {IConnectionDetailMysqlItem, IConnectionDetailRedisItem, IMysqlConnectionModel, IRedisConnectionModel} from './connection';
import {ITaskDetailItem, ITaskModel} from './task';
import {ITaskReportDetailItem, ITaskReportModel} from './task_report';

/**
 * Task exclude unit map
 */
interface ITaskExcludeUnit extends IIndexMap<true> {}

/**
 * Return data
 */
/**
 * Task execution flow list item
 */
export interface ITaskFlowListItem {
    _id?: string;
    name?: string;
    taskId?: string;
    taskName?: string;
    createdAt?: string;
    updateAt?: number;
    status?: TaskFlowStatus;
}

/**
 * Task execution flow detail
 */
export interface ITaskFlowDetailItem extends ITaskFlowListItem {
    startPage?: string;
    mysqlId?: string;
    mysqlDetail?: IConnectionDetailMysqlItem;
    redisId?: string;
    redisDetail?: IConnectionDetailRedisItem;
    excludeOption?: ITaskExcludeUnit;
    taskDetail?: ITaskDetailItem;
    taskReportMap?: IIndexMap<ITaskReportDetailItem>;
    createdUser?: string;
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
    excludeOption?: ITaskExcludeUnit;
    taskId: Schema.Types.ObjectId;
    taskName?: string;
    createdUser: Types.ObjectId;
    status: TaskFlowStatus;
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
 * Task execution flow modify model
 */
export interface ITaskFlowModifyModel {
    status: TaskFlowStatus;
}

/**
 * Task execution flow serach model
 */
export interface ITaskFlowSearchModel {
    name: string;
    status?: TaskFlowStatus;
    createdUser?: Types.ObjectId;
}
