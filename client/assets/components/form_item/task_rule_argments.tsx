/**
 * Task rule argments modify
 */
import * as React from 'react';

import {ITaskRuleArgmentsProps} from '../../interfaces/task';
import {TaskType} from '../../types/common';

import TaskRuleArgmentsData from './task_rule_argments_data';
import TaskRuleArgmentsDom from './task_rule_argments_dom';
import TaskRuleArgmentsEvent from './task_rule_argments_event';
import TaskRuleArgmentsPage from './task_rule_argments_page';
import TaskRuleArgmentsTime from './task_rule_argments_time';

export default class TaskRuleArgments extends React.Component<ITaskRuleArgmentsProps> {
    public render() {
        const {argments, type, subType, form} = this.props;
        switch (type) {
            case TaskType.TYPE_DATA:
                return <TaskRuleArgmentsData subType={subType} argments={argments} form={form} />;
            case TaskType.TYPE_DOM:
                return <TaskRuleArgmentsDom subType={subType} argments={argments} form={form} />;
            case TaskType.TYPE_EVENT:
                return <TaskRuleArgmentsEvent subType={subType} argments={argments} form={form} />;
            case TaskType.TYPE_TIME:
                return <TaskRuleArgmentsTime subType={subType} argments={argments} form={form} />;
            case TaskType.TYPE_PAGE:
                return <TaskRuleArgmentsPage subType={subType} argments={argments} form={form} />;
            default:
                return null;
        }
    }
}
