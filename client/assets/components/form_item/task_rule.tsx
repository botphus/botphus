import {Button, Card, Popconfirm} from 'antd';
import * as React from 'react';

import {TaskSaveRuleTypeItem} from '../../types/common';

import {localePkg} from '../../lib/const';

interface ITaskRuleProps {
    value: TaskSaveRuleTypeItem;
    index: string;
    onChange: (index: string, value: TaskSaveRuleTypeItem) => void;
    onRemove: (index: string, value: TaskSaveRuleTypeItem) => void;
}

export default class TaskRule extends React.Component<ITaskRuleProps> {
    public render() {
        const {value, onChange, onRemove, index} = this.props;
        return (
            <Card title={value.name} className="app-task-rule-item" extra={(
                <div>
                    <Button className="m-r" onClick={() => onChange(index, value)}>{localePkg.Client.Action.modify}</Button>
                    <Popconfirm title={localePkg.Client.Help.removeAction} onConfirm={() => onRemove(index, value)}>
                        <Button type="danger">{localePkg.Client.Action.remove}</Button>
                    </Popconfirm>
                </div>
            )} />
        );
    }
}
