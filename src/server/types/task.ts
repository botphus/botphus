import {ITaskSaveDataRuleItem, ITaskSaveDomRuleItem, ITaskSaveEventRuleItem, ITaskSavePageRuleItem, ITaskSaveTimeRuleItem} from '../interfaces/model/task';

/**
 * Rewrite rule type item
 */
export type TaskSaveRuleTypeItem = ITaskSaveDataRuleItem | ITaskSaveDomRuleItem | ITaskSaveEventRuleItem | ITaskSavePageRuleItem | ITaskSaveTimeRuleItem;

/**
 * Task page type
 */
export enum TaskPageType {
    'NORMAL'= 1,
    'SINGLE_PAGE'= 2,
}
