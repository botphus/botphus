import {MessageType, TaskMessage} from 'botphus-core';
import {ChildProcess} from 'child_process';

import {IIndexMap} from '../interfaces/common';
import {ITaskReportModel, ITaskReportModifyModel} from '../interfaces/model/task_report';
import {SocketMessageType} from '../types/socket';
import {TaskReportStatus} from '../types/task';

import {app} from './util';

/**
 * Listen task messsage that botphus child process send
 * @param {ChildProcess}                subProcess    Child process
 * @param {IIndexMap<ITaskReportModel>} taskReportMap Task report map
 * @param {string}                      userId        User ID
 * @param {Function}                    sendFunc      Send message func
 */
export function listenBotphusTaskMessage(
    subProcess: ChildProcess, taskReportMap: IIndexMap<ITaskReportModel>, userId: string,
    sendFunc: (reportItem: ITaskReportModel, updateData: ITaskReportModifyModel, userId: string, messageType?: SocketMessageType) => void
): void {
    subProcess.on('message', ([error, messageData]: TaskMessage) => {
        const updateData: ITaskReportModifyModel = {};
        if (error) {
            updateData.message = error.stack;
            updateData.status = TaskReportStatus.FAILED;
            if (error.index && taskReportMap[error.index]) {
                return sendFunc(taskReportMap[error.index], updateData, userId);
            }
            // Find cur pending index
            let lastReport;
            const reportList = Object.keys(taskReportMap);
            reportList.some((key, index) => {
                const curReport = taskReportMap[key];
                if (curReport.status === TaskReportStatus.ONGOING || curReport.status === TaskReportStatus.PENDING || index === reportList.length - 1) {
                    lastReport = curReport;
                    return true;
                }
                return false;
            });
            if (lastReport) {
                sendFunc(lastReport, updateData, userId);
            }
            return;
        }
        app.log.debug(messageData);
        const taskReport = taskReportMap[messageData.index];
        // Check report item, it maybe undefined when addtional task has been executed
        if (!taskReport) {
            return;
        }
        switch (messageData.type) {
            case MessageType.TASK_UNIT_EXEC_START:
                // Reset info
                updateData.status = TaskReportStatus.ONGOING;
                sendFunc(taskReport, updateData, userId);
                break;
            case MessageType.TASK_UNIT_EXEC_DATA_RECEIVE:
                updateData.status = TaskReportStatus.ONGOING;
                updateData.receiveData = typeof messageData.data === 'object' ? JSON.stringify(messageData.data) : messageData.data;
                sendFunc(taskReport, updateData, userId);
                break;
            case MessageType.TASK_UNIT_EXEC_END:
                updateData.status = TaskReportStatus.SUCCESS;
                // Update report map
                taskReport.status = TaskReportStatus.SUCCESS;
                sendFunc(taskReport, updateData, userId);
                break;
        }
    });
}
