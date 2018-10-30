import BotphusCore from 'botphus-core';

import {ITaskRuleSaveItem} from '../interfaces/model/task';
import {ITaskFlowDetailModel} from '../interfaces/model/task_flow';
import {SystemCode} from '../types/common';
import {TaskTypeEventSubType} from '../types/task';

import {getTaskItemTreeList} from './task';
import {createSystemError, localePkg} from './util';

const botphusCore = new BotphusCore();

/**
 * Build and run botphus task
 * @param  {ITaskFlowDetailModel} taskFlowData [description]
 * @return {Promise<void>}                     [description]
 */
export function buildAndRunBotphusTask(taskFlowData: ITaskFlowDetailModel): Promise<void> {
    return botphusCore.createTask(
        taskFlowData.taskDetail.name,
        new Date(taskFlowData.taskDetail.updateAt).getTime(),
        rebuildTaskRuleForBotphusTask(taskFlowData.taskDetail.ruleItems)
    )
        .then((_taskNo) => {
            // todo, start task
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
                        arguments: [item.arguments[0], new Function('request', `request.url().indexOf("${item.arguments[1]}") >= 0`)]
                    };
                }
                break;
            default:
                return item;
        }
    });
    return getTaskItemTreeList(rebuildRuleItems);
}
