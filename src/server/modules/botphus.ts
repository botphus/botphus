import {IProcessPoolWorkEvent, MessageType, TaskMessage} from '@botphus/server-runner';

import {IIndexMap} from '../interfaces/common';
import {ITaskRuleSaveItem} from '../interfaces/model/task';
import {ITaskReportModel, ITaskReportModifyModel} from '../interfaces/model/task_report';
import {defaultStartOption} from '../types/botphus';
import {SocketMessageType} from '../types/socket';
import {TaskPageType, TaskReportStatus, TaskTypeEventSubType, TaskTypePageSubType} from '../types/task';

import {getTaskItemTreeList} from './task';
import {app, isObjEmpty} from './util';

/**
 * Listen task messsage that botphus child process send
 * @param {IProcessPoolWorkEvent}       event         Event listener
 * @param {IIndexMap<ITaskReportModel>} taskReportMap Task report map
 * @param {string}                      userId        User ID
 * @param {Function}                    sendFunc      Send message func
 */
export function listenBotphusTaskMessage(
    event: IProcessPoolWorkEvent, taskReportMap: IIndexMap<ITaskReportModel>, userId: string,
    sendFunc: (reportItem: ITaskReportModel, updateData: ITaskReportModifyModel, userId: string, messageType?: SocketMessageType) => void
): void {
    event.on('message', ([error, messageData]: TaskMessage) => {
        const updateData: ITaskReportModifyModel = {};
        if (messageData && !isObjEmpty(messageData.context)) {
            updateData.context = JSON.stringify(messageData.context);
        }
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

/**
 * Rebuild task rule for botphus task
 * @param  {ITaskRuleSaveItem[]} ruleItems Rule item list
 * @return {any[]}                         Botphus task list
 */
export function rebuildTaskRuleForBotphusTask(pageType: TaskPageType, ruleItems: ITaskRuleSaveItem[]): any[] {
    // Rebuild arguments
    const rebuildRuleItems: ITaskRuleSaveItem[] = ruleItems.map((item) => {
        switch (item.subType) {
            // Add check function
            case TaskTypeEventSubType.SUB_TYPE_REQUEST:
            case TaskTypeEventSubType.SUB_TYPE_RESPONSE:
                // Check match path
                if (item.arguments && item.arguments[1]) {
                    return {...item,
                        arguments: [item.arguments[0],
                        /* tslint:disable */
                        new Function('request', `return request.url().indexOf("${item.arguments[1]}") >= 0`)]
                        /* tslint:enable */
                    };
                }
                break;
            // Add page option
            case TaskTypePageSubType.SUB_TYPE_GOTO:
                if (item.arguments && !item.arguments[1]) {
                    return {...item,
                        arguments: [item.arguments[0], defaultStartOption[TaskPageType[pageType]].startPageOption]
                    };
                }
                break;
            case TaskTypePageSubType.SUB_TYPE_RELOAD:
                if (item.arguments && item.arguments.length === 0) {
                    return {...item,
                        arguments: [defaultStartOption[TaskPageType[pageType]].startPageOption]
                    };
                }
                break;
        }
        return item;
    });
    return getTaskItemTreeList(rebuildRuleItems);
}
