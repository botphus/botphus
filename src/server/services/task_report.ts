import {Schema} from 'mongoose';

import {TaskReport} from '../models/';

import {IIndexMap} from '../interfaces/common';
import {ITaskReportBaseItem, ITaskReportModel, ITaskReportModifyModel} from '../interfaces/model';
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
    }).select('index status message receiveData flowId').exec()
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
 * Modify task report by ID
 * @param  {Schema.Types.ObjectId}  taskReportId   Task report ID
 * @param  {ITaskReportModifyModel} taskReportData task report modify data
 * @return {Promise<any>}                          Promise with task report id
 */
export function modifyTaskReportById(taskReportId: Schema.Types.ObjectId, taskReportData: ITaskReportModifyModel): Promise<any> {
    return TaskReport.updateOne({
        _id: taskReportId
    }, taskReportData).exec();
}

/**
 * Pend task report by flow ID
 * @param  {Schema.Types.ObjectId} taskFlowId Task flow ID
 * @return {Promise<void[]>}                  Pend success
 */
export function pendTaskReportByFlowId(taskFlowId: Schema.Types.ObjectId): Promise<any> {
    return modifyTaskReports({
        flowId: taskFlowId,
        status: {
            $in: [TaskReportStatus.FAILED, TaskReportStatus.SUCCESS]
        }
    }, {
        message: '',
        receiveData: '',
        status: TaskReportStatus.PENDING,
    });
}

/**
 * Modify task reports
 * @param  {any}                    query      Update query condition
 * @param  {ITaskReportModifyModel} updateData Update data
 * @return {Promise<any>}                      Promise
 */
export function modifyTaskReports(query: any, updateData: ITaskReportModifyModel): Promise<any> {
    return TaskReport.updateMany(query, updateData)
        .exec();
}
