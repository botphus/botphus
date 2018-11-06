import BotphusCore, {ITaskStartOption, MessageType, TaskMessage} from 'botphus-core';
import {ChildProcess} from 'child_process';

import {IIndexMap} from '../interfaces/common';
import {ITaskRuleSaveItem} from '../interfaces/model/task';
import {ITaskFlowDetailModel} from '../interfaces/model/task_flow';
import {ITaskReportModel, ITaskReportModifyModel} from '../interfaces/model/task_report';
import {defaultStartOption} from '../types/botphus';
import {SystemCode} from '../types/common';
import {SocketMessageType} from '../types/socket';
import {TaskPageType, TaskReportStatus, TaskTypeEventSubType} from '../types/task';

import {modifyTaskReportById} from '../services/task_report';
import {send} from './socket';
import {getTaskItemTreeList} from './task';
import {app, createSystemError, localePkg} from './util';

const botphusCore = new BotphusCore();

/**
 * Build and run botphus task
 * @param  {ITaskFlowDetailModel}  taskFlowData Task flow data
 * @return {Promise<ChildProcess>}              Promise with child process
 */
export function buildAndRunBotphusTask(taskFlowData: ITaskFlowDetailModel): Promise<ChildProcess> {
    return botphusCore.createTask(
        taskFlowData.taskDetail.name,
        new Date(taskFlowData.taskDetail.updateAt).getTime(),
        rebuildTaskRuleForBotphusTask(taskFlowData.taskDetail.ruleItems)
    )
        .then((taskNo) => {
            const startOption: ITaskStartOption = {
                ...defaultStartOption[TaskPageType[taskFlowData.taskDetail.pageType]],
                excludeOption: taskFlowData.excludeOption,
                mysqlOption: taskFlowData.mysqlId ? taskFlowData.mysqlDetail.config : undefined,
                redisOption: taskFlowData.redisId ? taskFlowData.redisDetail.config : undefined
            };
            app.log.debug(taskFlowData._id, 'startOption:');
            app.log.debug(JSON.stringify(startOption));
            return botphusCore.startTask(taskNo, taskFlowData.startPage || '', startOption)
                .then((subProcess) => {
                    listenBotphusTaskMessage(subProcess, taskFlowData.taskReportMap, taskFlowData.createdUser.toString());
                    return subProcess;
                });
        }, (err) => {
            throw createSystemError(`${localePkg.Service.TaskFlow.taskCreateError}:${err.message}`, SystemCode.ROUTINE_ERROR);
        });
}

/**
 * Rebuild task rule for botphus task
 * @param  {ITaskRuleSaveItem[]} ruleItems Rule item list
 * @return {any[]}                         Botphus task list
 */
function rebuildTaskRuleForBotphusTask(ruleItems: ITaskRuleSaveItem[]): any[] {
    // Rebuild arguments
    const rebuildRuleItems: ITaskRuleSaveItem[] = ruleItems.map((item) => {
        switch (item.subType) {
            case TaskTypeEventSubType.SUB_TYPE_REQUEST:
            case TaskTypeEventSubType.SUB_TYPE_RESPONSE:
                // Check match path
                if (item.arguments[1]) {
                    return {...item,
                        arguments: [item.arguments[0], new Function('request', `return request.url().indexOf("${item.arguments[1]}") >= 0`)]
                    };
                }
                break;
            default:
                return item;
        }
    });
    return getTaskItemTreeList(rebuildRuleItems);
}

/**
 * Listen task messsage that botphus child process send
 * @param {ChildProcess}                subProcess    Child process
 * @param {IIndexMap<ITaskReportModel>} taskReportMap Task report map
 * @param {string}                      userId        User ID
 */
function listenBotphusTaskMessage(subProcess: ChildProcess, taskReportMap: IIndexMap<ITaskReportModel>, userId: string): void {
    subProcess.on('message', ([error, messageData]: TaskMessage) => {
        const updateData: ITaskReportModifyModel = {};
        if (error) {
            updateData.message = error.stack;
            updateData.status = TaskReportStatus.FAILED;
            if (error.index) {
                return sendTaskFlowData(taskReportMap[error.index], updateData, userId);
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
                sendTaskFlowData(lastReport, updateData, userId);
            }
            return;
        }
        app.log.debug(messageData);
        switch (messageData.type) {
            case MessageType.TASK_UNIT_EXEC_START:
                // Reset info
                updateData.status = TaskReportStatus.ONGOING;
                sendTaskFlowData(taskReportMap[messageData.index], updateData, userId);
                break;
            case MessageType.TASK_UNIT_EXEC_DATA_RECEIVE:
                updateData.status = TaskReportStatus.ONGOING;
                updateData.receiveData = typeof messageData.data === 'object' ? JSON.stringify(messageData.data) : messageData.data;
                sendTaskFlowData(taskReportMap[messageData.index], updateData, userId);
                break;
            case MessageType.TASK_UNIT_EXEC_END:
                updateData.status = TaskReportStatus.SUCCESS;
                // Update report map
                taskReportMap[messageData.index].status = TaskReportStatus.SUCCESS;
                sendTaskFlowData(taskReportMap[messageData.index], updateData, userId);
                break;
        }
    });
}

/**
 * Update task report data & send socket message
 * @param {ITaskReportModel}       reportItem  Report item
 * @param {ITaskReportModifyModel} updateData  Update data
 * @param {string}                 userId      User ID
 * @param {SocketMessageType}      messageType Message type
 */
export function sendTaskFlowData(
    reportItem: ITaskReportModel, updateData: ITaskReportModifyModel, userId: string, messageType: SocketMessageType = SocketMessageType.UPDATE): void {
    // Update report data
    if (typeof updateData.status === 'number') {
        modifyTaskReportById(reportItem._id, updateData);
    }
    // Send socket message
    switch (messageType) {
        case SocketMessageType.UPDATE:
            return send(messageType, `${reportItem.flowId}|${reportItem.index}|${JSON.stringify(updateData)}`, userId);
        default:
            return send(messageType, `${reportItem.flowId}|${updateData.message}`, userId);
    }
}
