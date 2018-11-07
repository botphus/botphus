import {Schema, Types} from 'mongoose';

import {TaskFlowStatus} from '../../types/task';
import {IModifyDateModel} from './';

import {IIndexMap} from '../common';
import {IConnectionDetailMysqlItem, IConnectionDetailRedisItem, IMysqlConnectionModel, IRedisConnectionModel} from './connection';
import {ITaskDetailItem, ITaskModel} from './task';
import {ITaskReportDetailItem, ITaskReportModel} from './task_report';
import {IUnionTaskDetailItem, IUnionTaskModel} from './union_task';

/**
 * Return data
 */
/**
 * Union task execution flow list item
 */
export interface IUnionTaskFlowListItem {
    _id?: string;
    name?: string;
    unionTaskId?: string;
    createdAt?: string;
    updateAt?: number;
    status?: TaskFlowStatus;
}

/**
 * Union task execution flow detail
 */
export interface IUnionTaskFlowDetailItem extends IUnionTaskFlowListItem {
    suffixDomain?: string;
    mysqlId?: string;
    mysqlDetail?: IConnectionDetailMysqlItem;
    redisId?: string;
    redisDetail?: IConnectionDetailRedisItem;
    excludeTask?: IIndexMap<true>;
    unionTaskMap: IUnionTaskDetailItem;
    taskDetailMap?: IIndexMap<ITaskDetailItem>;
    taskReportMap?: IIndexMap<ITaskReportDetailItem>;
}

/**
 * Union task execution flow model
 */
export interface IUnionTaskFlowModel extends IModifyDateModel {
    name: string;
    suffixDomain?: string;
    // mysql config id
    mysqlId?: Schema.Types.ObjectId;
    // redis config id
    redisId?: Schema.Types.ObjectId;
    excludeTask?: IIndexMap<true>;
    unionTaskId: Schema.Types.ObjectId;
    createdUser: Types.ObjectId;
    status: TaskFlowStatus;
}

/**
 * Union task execution flow detail model
 */
export interface IUnionTaskFlowDetailModel extends IUnionTaskFlowModel {
    mysqlDetail?: IMysqlConnectionModel;
    redisDetail?: IRedisConnectionModel;
    unionTaskDetail?: IUnionTaskModel;
    taskDetailMap?: IIndexMap<ITaskModel>;
    taskReportMap?: IIndexMap<ITaskReportModel>;
}

/**
 * Union task execution flow modify model
 */
export interface IUnionTaskFlowModifyModel {
    status: TaskFlowStatus;
}

/**
 * Union task execution flow serach model
 */
export interface IUnionTaskFlowSearchModel {
    name: string;
    status?: TaskFlowStatus;
    createdUser?: Types.ObjectId;
}
