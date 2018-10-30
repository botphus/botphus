/**
 * Task rule arguments modify
 */
import * as React from 'react';

import {ITaskRuleArgumentsProps} from '../../interfaces/task';
import {TaskType} from '../../types/common';

import TaskRuleArgumentsData from './task_rule_arguments_data';
import TaskRuleArgumentsDom from './task_rule_arguments_dom';
import TaskRuleArgumentsEvent from './task_rule_arguments_event';
import TaskRuleArgumentsPage from './task_rule_arguments_page';
import TaskRuleArgumentsTime from './task_rule_arguments_time';

export default class TaskRuleArguments extends React.Component<ITaskRuleArgumentsProps> {
    public render() {
        const {type, subType, form} = this.props;
        switch (type) {
            case TaskType.TYPE_DATA:
                return <TaskRuleArgumentsData subType={subType} arguments={this.props.arguments} form={form} />;
            case TaskType.TYPE_DOM:
                return <TaskRuleArgumentsDom subType={subType} arguments={this.props.arguments} form={form} />;
            case TaskType.TYPE_EVENT:
                return <TaskRuleArgumentsEvent subType={subType} arguments={this.props.arguments} form={form} />;
            case TaskType.TYPE_TIME:
                return <TaskRuleArgumentsTime subType={subType} arguments={this.props.arguments} form={form} />;
            case TaskType.TYPE_PAGE:
                return <TaskRuleArgumentsPage subType={subType} arguments={this.props.arguments} form={form} />;
            default:
                return null;
        }
    }
}
