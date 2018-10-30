import {FormComponentProps} from 'antd/lib/form/Form';

export {IConnectionDetailItem, IConnectionListItem} from '../../../src/server/interfaces/model/connection';
export {ITaskRuleSaveItem, ITaskRuleTreeItem, ITaskDetailItem, ITaskListItem} from '../../../src/server/interfaces/model/task';
export {ITaskFlowDetailItem, ITaskFlowListItem} from '../../../src/server/interfaces/model/task_flow';
export {ITaskReportDetailItem} from '../../../src/server/interfaces/model/task_report';

import {TaskSubType, TaskType} from '../types/common';

/**
 * Task rule Arguments
 */
export interface ITaskRuleArgumentsProps extends FormComponentProps {
    arguments: any[];
    type: TaskType;
    subType: TaskSubType;
}

export interface ITaskRuleArgumentsSubProps extends FormComponentProps {
    arguments: any[];
    subType: TaskSubType;
}
