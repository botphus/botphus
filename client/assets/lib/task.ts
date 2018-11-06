export {getTaskItemRelatedIds, getTaskItemTreeList} from '../../../src/server/modules/task';

import {IIndexMap} from '../interfaces/common';
import {ITaskRuleSaveItem} from '../interfaces/task';
import {TaskSubType, TaskType, TaskTypeDataSubType, TaskTypeDomSubType, TaskTypePageSubType, TaskTypeTimeSubType} from '../types/common';

import {localePkg} from '../lib/const';

/**
 * Translate task arguments
 * @param  {TaskType}          type    Task Type
 * @param  {TaskSubType}       subType Task sub type
 * @param  {IIndexMap<string>} args    Args
 * @return {any[]}                     task arguments
 */
export function translateModifyRuleItemArgs(type: TaskType, subType: TaskSubType, args: IIndexMap<string>): any[] {
    const returnArgs = [];
    switch (type) {
        case TaskType.TYPE_DATA:
            switch (subType) {
                case TaskTypeDataSubType.SUB_TYPE_MYSQL:
                    return [args.mysql];
                case TaskTypeDataSubType.SUB_TYPE_REDIS:
                    return [args.redis.split(' ')];
            }
            break;
        case TaskType.TYPE_DOM:
            const domArgs = [args.querySelector];
            switch (subType) {
                case TaskTypeDomSubType.SUB_TYPE_CLICK:
                    domArgs.push(args.humanClick);
                    break;
                case TaskTypeDomSubType.SUB_TYPE_KEYBOARD:
                    domArgs.push(args.querySelectorText);
                    break;
                case TaskTypeDomSubType.SUB_TYPE_GET_ATTR:
                    domArgs.push(args.querySelectorAttrName);
                    break;
                case TaskTypeDomSubType.SUB_TYPE_SET_ATTR:
                    domArgs.push(args.querySelectorAttrName);
                    domArgs.push(args.querySelectorAttrValue);
                    break;
            }
            return domArgs;
        case TaskType.TYPE_EVENT:
            const eventArgs = [args.eventTimeout];
            if (args.eventPath) {
                eventArgs.push(args.eventPath);
            }
            return eventArgs;
        case TaskType.TYPE_PAGE:
            switch (subType) {
                case TaskTypePageSubType.SUB_TYPE_GOTO:
                    return [args.gotoPath];
            }
            break;
        case TaskType.TYPE_TIME:
            switch (subType) {
                case TaskTypeTimeSubType.SUB_TYPE_SET_SLEEP:
                    return [args.sleepTime];
            }
            break;
    }
    return returnArgs;
}

/**
 * Valid rule items
 * @param  {ITaskRuleSaveItem[]} items Rule list
 * @return {string}                    Error message
 */
export function validRuleItems(items: ITaskRuleSaveItem[]): string {
    const eventSubTypeCountMap: IIndexMap<number> = {};
    items.forEach((item) => {
        // Set event count map
        if (item.type === TaskType.TYPE_EVENT) {
            eventSubTypeCountMap[item.id] = 0;
        } else if (eventSubTypeCountMap[item.pid] >= 0) { // Check count
            eventSubTypeCountMap[item.pid] = eventSubTypeCountMap[item.pid] + 1;
        }
    });
    const countValidResult = Object.keys(eventSubTypeCountMap).some((index) => {
        return eventSubTypeCountMap[index] === 0;
    });
    if (countValidResult) {
        return localePkg.Client.Help.taskRuleEventEmptyTip;
    }
    return '';
}
