import {Schema} from 'mongoose';

import {TaskReport} from '../models/';

import {ITaskReportModel} from '../interfaces/model';

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
 * Query task report list by flow ID
 * @param  {Schema.Types.ObjectId}                 taskFlowId Task flow ID
 * @param  {number}                                page       Page
 * @param  {number}                                pageSize   Page size
 * @param  {string}                                fields     Field list
 * @return {Promise<[number, ITaskReportModel[]]>}            Promise with total number & task report info list
 */
export function queryTaskReportListByFlowId(taskFlowId: Schema.Types.ObjectId, page: number, pageSize: number, fields: string): Promise<[number, ITaskReportModel[]]> {
    const condition: any = {
        flowId: taskFlowId
    };
    return Promise.all([
        TaskReport.count(condition).exec(),
        TaskReport.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: 1
        }).exec()
    ]);
}

/**
 * Createa task report info
 * @param  {ITaskReportModel}          taskReportData Task report data
 * @return {Promise<ITaskReportModel>}                Promise with task report Info
 */
export function createTaskReport(taskReportData: ITaskReportModel): Promise<ITaskReportModel> {
    const taskReport = Object.assign(new TaskReport(), taskReportData);
    return taskReport.save();
}
