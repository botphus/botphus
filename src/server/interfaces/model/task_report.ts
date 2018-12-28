import {Schema} from 'mongoose';

import {TaskReportStatus, TaskReportType} from '../../types/task';
import {IModifyDateModel} from './';

/**
 * Return data
 */
export interface ITaskReportDetailItem {
    _id?: string;
    index?: string;
    status?: TaskReportStatus;
    type?: TaskReportType;
    context?: string;
    message?: string;
    receiveData?: string;
    flowId?: string;
    updateAt?: Date;
}

/**
 * Task report base item
 */
export interface ITaskReportBaseItem {
    // Unit index
    index: string;
    // Status
    status: TaskReportStatus;
    // Type
    type: TaskReportType;
    context?: string;
    message?: string;
    receiveData: string;
    // Execution flow ID
    flowId: Schema.Types.ObjectId;
}

/**
 * Task execution report model
 */
export interface ITaskReportModel extends ITaskReportBaseItem, IModifyDateModel {}

/**
 * Task execution report modify model
 */
export interface ITaskReportModifyModel {
    status?: TaskReportStatus;
    context?: string;
    message?: string;
    receiveData?: string;
}
