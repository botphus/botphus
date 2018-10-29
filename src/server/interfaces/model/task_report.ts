import {Document, Schema} from 'mongoose';

import {TaskReportStatus} from '../../types/task';

/**
 * Task report base item
 */
export interface ITaskReportBaseItem {
    // Unit index
    index: string;
    // Status
    status: TaskReportStatus;
    // Result message
    message: string;
    // Execution flow ID
    flowId: Schema.Types.ObjectId;
}

/**
 * Task execution report model
 */
export interface ITaskReportModel extends ITaskReportBaseItem, Document {}
