import {Schema} from 'mongoose';

import {TaskReportStatus, TaskReportType} from '../../types/task';
import {IModifyDateModel} from './';

/**
 * Return data
 */
export interface ITaskReportDetailItem {
    index?: string;
    status?: TaskReportStatus;
    type?: TaskReportType;
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
    // Result message
    message: string;
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
    message?: string;
    receiveData?: string;
}
