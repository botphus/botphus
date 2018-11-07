import BotphusCore, {ITaskStartOption} from 'botphus-core';
import {ChildProcess} from 'child_process';

import {ITaskReportModel, ITaskReportModifyModel} from '../interfaces/model/task_report';
import {IUnionTaskFlowDetailModel} from '../interfaces/model/union_task_flow';
import {defaultStartOption} from '../types/botphus';
import {SystemCode} from '../types/common';
import {SocketMessageType} from '../types/socket';
import {TaskPageType, TaskReportType, TaskType, TaskTypePageSubType, TaskTypeUnionSubType} from '../types/task';

import {modifyTaskReportById} from '../services/task_report';
import {listenBotphusTaskMessage} from './botphus';
import {send} from './socket';
import {rebuildTaskRuleForBotphusTask} from './task';
import {app, createSystemError, localePkg} from './util';

const botphusCore = new BotphusCore();

/**
 * Build and run botphus task
 * @param  {ITaskFlowDetailModel}  taskFlowData Task flow data
 * @return {Promise<ChildProcess>}              Promise with child process
 */
export function buildAndRunUnionBotphusTask(unionTaskFlowData: IUnionTaskFlowDetailModel): Promise<ChildProcess> {
    let lastModifyDate: Date = new Date(); // Default set now
    let pageType: TaskPageType = TaskPageType.NORMAL;
    if (unionTaskFlowData.taskDetailMap) {
        Object.keys(unionTaskFlowData.taskDetailMap).forEach((key, index) => {
            const curTask = unionTaskFlowData.taskDetailMap[key];
            const curDate = new Date(curTask.updateAt);
            if (index === 0 || lastModifyDate < curDate) {
                return lastModifyDate = curDate;
            }
            // Set page type
            if (pageType === TaskPageType.NORMAL && curTask.pageType !== pageType) {
                pageType = curTask.pageType;
            }
        });
    }
    return botphusCore.createTask(
        `uniontask-${unionTaskFlowData.unionTaskDetail.name}`,
        lastModifyDate.getTime(),
        rebuildTaskListRuleForBotphusTask(unionTaskFlowData)
    )
        .then((taskNo) => {
            const startOption: ITaskStartOption = {
                ...defaultStartOption[TaskPageType[pageType]],
                mysqlOption: unionTaskFlowData.mysqlId ? unionTaskFlowData.mysqlDetail.config : undefined,
                redisOption: unionTaskFlowData.redisId ? unionTaskFlowData.redisDetail.config : undefined
            };
            app.log.debug(unionTaskFlowData._id, 'startOption:');
            app.log.debug(startOption);
            return botphusCore.startTask(taskNo, '', startOption)
                .then((subProcess) => {
                    listenBotphusTaskMessage(subProcess, unionTaskFlowData.taskReportMap, unionTaskFlowData.createdUser.toString(), sendUnionTaskFlowData);
                    return subProcess;
                });
        }, (err) => {
            throw createSystemError(`${localePkg.Service.TaskFlow.taskCreateError}:${err.message}`, SystemCode.ROUTINE_ERROR);
        });
}

/**
 * Rebuild task list rule for botphus task
 * @param  {IUnionTaskFlowDetailModel} unionTaskFlowData Union task flow data
 * @return {any[]}                                       Botphus task list
 */
function rebuildTaskListRuleForBotphusTask(unionTaskFlowData: IUnionTaskFlowDetailModel): any[] {
    const taskList: any[] = [];
    if (unionTaskFlowData.unionTaskDetail) {
        unionTaskFlowData.unionTaskDetail.taskItems.forEach((taskItem) => {
            const curTask = unionTaskFlowData.taskDetailMap[taskItem.taskId];
            if (curTask) {
                const curStartOption = defaultStartOption[TaskPageType[curTask.pageType]];
                // Goto start page
                let taskRule: any[] = taskItem.startPage ? [
                    {
                        arguments: [
                            unionTaskFlowData.suffixDomain ? taskItem.startPage.replace(/\${suffixDomain}/g, unionTaskFlowData.suffixDomain) : taskItem.startPage,
                            curStartOption.startPageOption
                        ],
                        index: `${taskItem.taskId}-start`,
                        subType: TaskTypePageSubType.SUB_TYPE_GOTO,
                        type: TaskType.TYPE_PAGE
                    }
                ] : [];
                // Build task
                taskRule = taskRule.concat(rebuildTaskRuleForBotphusTask(curTask.ruleItems.map((item) => {
                    return {
                        ...item,
                        index: `${taskItem.taskId}-${item.id}`
                    };
                })));
                // Add union task
                taskList.push({
                    children: taskRule,
                    index: taskItem.taskId,
                    subType: taskItem.ignoreError ? TaskTypeUnionSubType.SUB_TYPE_NON_BLOCK : TaskTypeUnionSubType.SUB_TYPE_BLOCK,
                    type: TaskType.TYPE_UNION
                });
            }
        });
    }
    return taskList;
}

/**
 * Update task report data & send socket message
 * @param {ITaskReportModel}       reportItem  Report item
 * @param {ITaskReportModifyModel} updateData  Update data
 * @param {string}                 userId      User ID
 * @param {SocketMessageType}      messageType Message type
 */
export function sendUnionTaskFlowData(
    reportItem: ITaskReportModel, updateData: ITaskReportModifyModel, userId: string, messageType: SocketMessageType = SocketMessageType.UPDATE): void {
    // Update report data
    if (typeof updateData.status === 'number') {
        modifyTaskReportById(reportItem._id, updateData);
    }
    // Send socket message
    switch (messageType) {
        case SocketMessageType.UPDATE:
            return send(messageType, `${TaskReportType.UNION_TASK}-${reportItem.flowId}|${reportItem.index}|${JSON.stringify(updateData)}`, userId);
        default:
            return send(messageType, `${TaskReportType.UNION_TASK}-${reportItem.flowId}|${updateData.message}`, userId);
    }
}
