import BotphusCore, {IProcessPoolWorkEvent, ITaskStartOption} from '@botphus/server-runner';

import {ITaskFlowDetailModel} from '../interfaces/model/task_flow';
import {ITaskReportModel, ITaskReportModifyModel} from '../interfaces/model/task_report';
import {defaultStartOption} from '../types/botphus';
import {SystemCode} from '../types/common';
import {SocketMessageType} from '../types/socket';
import {TaskPageType, TaskReportType} from '../types/task';

import {modifyTaskReportById} from '../services/task_report';
import {listenBotphusTaskMessage, rebuildTaskRuleForBotphusTask} from './botphus';
import {send} from './socket';
import {app, createSystemError, localePkg} from './util';

const botphusCore = new BotphusCore();

/**
 * Build and run botphus task
 * @param  {ITaskFlowDetailModel}           taskFlowData Task flow data
 * @return {Promise<IProcessPoolWorkEvent>}              Promise with Event
 */
export function buildAndRunBotphusTask(taskFlowData: ITaskFlowDetailModel): Promise<IProcessPoolWorkEvent> {
    return botphusCore.createTask(
        taskFlowData.taskDetail._id.toString(),
        new Date(taskFlowData.taskDetail.updateAt).getTime(),
        rebuildTaskRuleForBotphusTask(taskFlowData.taskDetail.pageType, taskFlowData.taskDetail.ruleItems)
    )
        .then((taskNo) => {
            const startOption: ITaskStartOption = {
                ...defaultStartOption[TaskPageType[taskFlowData.taskDetail.pageType]],
                excludeOption: taskFlowData.excludeOption,
                mysqlOption: taskFlowData.mysqlId ? taskFlowData.mysqlDetail.config : undefined,
                redisOption: taskFlowData.redisId ? taskFlowData.redisDetail.config : undefined
            };
            app.log.debug(taskFlowData._id, 'startOption:');
            app.log.debug(startOption);
            return botphusCore.startTask(taskNo, taskFlowData.startPage || '', startOption)
                .then((event) => {
                    listenBotphusTaskMessage(event, taskFlowData.taskReportMap, taskFlowData.createdUser.toString(), sendTaskFlowData);
                    return event;
                });
        }, (err) => {
            throw createSystemError(`${localePkg.Service.TaskFlow.taskCreateError}:${err.message}`, SystemCode.ROUTINE_ERROR);
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
    reportItem: ITaskReportModel, updateData: ITaskReportModifyModel, userId: string, messageType: SocketMessageType = SocketMessageType.TASK_UPDATE): void {
    // Update report data
    if (typeof updateData.status === 'number') {
        modifyTaskReportById(reportItem._id, updateData);
    }
    // Send socket message
    switch (messageType) {
        case SocketMessageType.TASK_UPDATE:
            return send(messageType, `${TaskReportType.TASK}-${reportItem.flowId}|${reportItem.index}|${JSON.stringify(updateData)}`, userId);
        default:
            return send(messageType, `${TaskReportType.TASK}-${reportItem.flowId}|${updateData.message}`, userId);
    }
}
