import * as React from 'react';

import {TaskSaveRuleTypeItem} from '../types/common';

interface ITaskRuleItemWrapper {
    onRender: (rule: TaskSaveRuleTypeItem, index: string) => React.ReactNode;
    rule: TaskSaveRuleTypeItem;
    index: string;
}

/**
 * Task rule wrapper for loop
 */
export default class TaskRuleItemWrapper extends React.Component<ITaskRuleItemWrapper> {
    public render() {
        const {rule, onRender, index} = this.props;
        return (
            <div className="app-task-rule">
                {onRender(rule, index)}
                {(rule.children && rule.children.length > 0) ? (
                    <div className="rule-sub-item">
                        {rule.children.map((subRule, subIndex) => {
                            const curIndex = `index-${subIndex}`;
                            return <TaskRuleItemWrapper index={curIndex} onRender={onRender} rule={subRule} />;
                        })}
                    </div>
                ) : null}
            </div>
        );
    }
}
