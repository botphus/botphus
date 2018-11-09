import {IIndexMap} from '../interfaces/common';
import {ITaskRuleSaveItem, ITaskRuleTreeItem} from '../interfaces/model/task';
import {defaultStartOption} from '../types/botphus';
import {TaskPageType, TaskTypeEventSubType, TaskTypePageSubType} from '../types/task';

/**
 * Translate task flat data to tree data;
 * @param  {ITaskRuleSaveItem[]} items Flat item list
 * @return {ITaskRuleTreeItem[]}       Tree item list
 */
export function getTaskItemTreeList(items: ITaskRuleSaveItem[]): ITaskRuleTreeItem[] {
    // Task Id tree
    const taskIdTreeMap: IIndexMap<string> = {};
    const taskRuleTreeItem: ITaskRuleTreeItem[] = [];
    items.forEach((item) => {
        const curItem: ITaskRuleTreeItem = {
            children: [],
            ...item,
            index: item.index || `${item.id}`
        };
        // If parent
        if (item.pid === 0) {
            const treeIndex = `${taskRuleTreeItem.length}`;
            taskIdTreeMap[`${item.id}`] = treeIndex;
            taskRuleTreeItem.push(curItem);
        // If child
        } else {
            const parentIndex = taskIdTreeMap[item.pid];
            const parentIndexList = parentIndex.split('-');
            let parentItem: ITaskRuleTreeItem[] = taskRuleTreeItem;
            parentIndexList.forEach((key) => {
                parentItem = parentItem[parseInt(key, 10)].children;
            });
            const treeIndex = `${parentIndex}-${parentItem.length}`;
            taskIdTreeMap[`${item.id}`] = treeIndex;
            parentItem.push(curItem);
        }
    });
    return taskRuleTreeItem;
}

/**
 * Get task item & children's ID map
 * @param {IIndexMap<number>} idMap      ID map
 * @param {ITaskRuleTreeItem} taskItem   Task rule item
 * @param {number}            startLevel Start level
 */
export function getTaskItemRelatedIds(idMap: IIndexMap<number>, taskItem: ITaskRuleTreeItem, startLevel: number = 0) {
    idMap[taskItem.id] = startLevel;
    taskItem.children.forEach((item) => {
        startLevel++;
        getTaskItemRelatedIds(idMap, item, startLevel);
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
                        arguments: [item.arguments[0], new Function('request', `return request.url().indexOf("${item.arguments[1]}") >= 0`)]
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
