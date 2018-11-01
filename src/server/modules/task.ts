import {IIndexMap} from '../interfaces/common';
import {ITaskRuleSaveItem, ITaskRuleTreeItem} from '../interfaces/model/task';

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
            index: `${item.id}`
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
