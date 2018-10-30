import {Schema} from 'mongoose';

import {TaskReport} from '../models/';

import {IIndexMap} from '../interfaces/common';
import {ITaskReportBaseItem, ITaskReportModel} from '../interfaces/model';
import {TaskReportStatus} from '../types/task';

/**
 * Query task report info by ID
 * @param  {Schema.Types.ObjectId}     taskReportId Task report ID
 * @param  {string}                    fields       Field list
 * @return {Promise<ITaskReportModel>}              Promise with TaskReport Info
 */
export function queryTaskReportById(taskReportId: Schema.Types.ObjectId, fields: string = null): Promise<ITaskReportModel> {
    return TaskReport.findById(taskReportId, fields).exec();
}

/**
 * Query task report type
 * @param  {Schema.Types.ObjectId} taskFlowId Task flow ID
 * @return {Promise}                          Promise with task report map
 */
export function queryTaskReportMap(taskFlowId: Schema.Types.ObjectId): Promise<IIndexMap<ITaskReportModel>> {
    return TaskReport.find({
        flowId: taskFlowId
    }).select('index status message flowId').exec()
        .then((taskReportList) => {
            const taskReportMap: IIndexMap<ITaskReportModel> = {};
            taskReportList.forEach((taskReport) => {
                taskReportMap[taskReport.index] = taskReport;
            });
            return taskReportMap;
        });
}

/**
 * Create task report list
 * @param  {ITaskReportBaseItem[]}       taskReportDataList Task report data list
 * @return {Promise<ITaskReportModel[]>}                    Promise with task report Info
 */
export function createTaskReports(taskReportDataList: ITaskReportBaseItem[]): Promise<ITaskReportModel[]> {
    // Create list
    return Promise.all(taskReportDataList.map((taskReportData) => {
        const taskReport = Object.assign(new TaskReport(), taskReportData);
        return taskReport.save();
    }));
}

/**
 * Pend task report by flow ID
 * @param  {Schema.Types.ObjectId} taskFlowId Task flow ID
 * @return {Promise<void[]>}                  Pend success
 */
export function pendTaskReportByFlowId(taskFlowId: Schema.Types.ObjectId): Promise<void[]> {
    return TaskReport.find({
        flowId: taskFlowId,
        status: {
            $in: [TaskReportStatus.FAILED, TaskReportStatus.SUCCESS]
        }
    })
        .then((taskReportList) => {
            return Promise.all(taskReportList.map((taskReport) => {
                return taskReport.update({
                    status: TaskReportStatus.PENDING
                });
            }));
        });
}
