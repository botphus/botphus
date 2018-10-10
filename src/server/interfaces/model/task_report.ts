import {Document, Schema} from 'mongoose';

/**
 * Task execution report model
 */
export interface ITaskReportModel extends Document {
    // Unit index
    index: string;
    // Success status
    success: boolean;
    // Result message
    message: string;
    // Execution flow ID
    flowId: Schema.Types.ObjectId;
}
