import {FormComponentProps} from 'antd/lib/form/Form';

export {ITaskRuleSaveItem, ITaskRuleTreeItem} from '../../../src/server/interfaces/model/task';
import {TaskSubType, TaskType} from '../types/common';

/**
 * Task rule Argments
 */
export interface ITaskRuleArgmentsProps extends FormComponentProps {
    argments: any[];
    type: TaskType;
    subType: TaskSubType;
}

export interface ITaskRuleArgmentsSubProps extends FormComponentProps {
    argments: any[];
    subType: TaskSubType;
}
