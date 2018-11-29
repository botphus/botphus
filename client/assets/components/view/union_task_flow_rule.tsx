import {Card} from 'antd';
import * as React from 'react';

import {IIndexMap} from '../../interfaces/common';
import {ITaskDetailItem, ITaskReportDetailItem, IUnionTaskSaveItem} from '../../interfaces/task';

import {localePkg} from '../../lib/const';

import TaskFlowRule from './task_flow_rule';

interface IUnionTaskFlowRuleProps {
    taskItems: IUnionTaskSaveItem[];
    taskDetailMap: IIndexMap<ITaskDetailItem>;
    reportMap: IIndexMap<ITaskReportDetailItem>;
}

export default class UnionTaskFlowRule extends React.Component<IUnionTaskFlowRuleProps> {
    public render() {
        const {taskItems, taskDetailMap, reportMap} = this.props;
        return (
            <div className="app-union-task-flow-rule">
                {taskItems.map((taskItem) => {
                    const curTask = taskDetailMap[taskItem.taskId];
                    return (
                        <Card className="m-b" key={taskItem.taskId} title={taskItem.name}>
                            {curTask ? (
                                <TaskFlowRule list={curTask.ruleItems || []} reportMap={reportMap} prefix={`${taskItem.taskId}-`} />
                            ) : localePkg.Client.Help.UnionTaskFlow.excludeTaskItem}
                        </Card>
                    );
                })}
            </div>
        );
    }
}
