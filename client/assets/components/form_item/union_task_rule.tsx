import {Icon, Popconfirm, Tree} from 'antd';
import {AntTreeNodeDropEvent} from 'antd/lib/tree/Tree';
import * as React from 'react';
const {TreeNode} = Tree;

import {IUnionTaskSaveItem} from '../../interfaces/task';

import {localePkg} from '../../lib/const';

interface ITaskRuleProps {
    value: IUnionTaskSaveItem[];
    checkValue?: string[];
    onCheck?: (checkedKeys) => void;
    onChange?: (taskId: string) => void;
    onRemove?: (taskId: string) => void;
    // before: dropPosition = -1
    // inset: dropPosition = 0
    // after: dropPosition = 1
    onDrag?: (dropKey: string, dragKey: string, dropPosition: number) => void;
}

export default class TaskRule extends React.Component<ITaskRuleProps> {
    public render() {
        const {checkValue, value, onChange, onDrag, onRemove, onCheck} = this.props;
        return (
            <Tree
                checkable={!!onCheck}
                checkedKeys={checkValue || []}
                defaultExpandAll
                className="app-task-rule"
                draggable={!!onDrag}
                onDrop={this.handleDrop}
                onCheck={onCheck}
            >
                {value.map((item) => {
                    const titleTitle = (
                        <div>
                            {item.name}
                            {/* action: modify */}
                            {onChange ? (
                                <Icon title={localePkg.Client.Action.modify} className="m-l" type="edit" theme="filled" onClick={() => onChange(item.taskId)} />
                            ) : null}
                            {/* action: remove */}
                            {onRemove ? (
                                <Popconfirm title={localePkg.Client.Help.removeAction} onConfirm={() => onRemove(item.taskId)}>
                                    <Icon title={localePkg.Client.Action.remove} className="m-l" type="delete" theme="filled" />
                                </Popconfirm>
                            ) : null}
                        </div>
                    );
                    return <TreeNode key={item.taskId} title={titleTitle} data={item} />;
                })}
            </Tree>
        );
    }
    private handleDrop = (info: AntTreeNodeDropEvent) => {
        const {onDrag} = this.props;
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        if (!(dropKey && dragKey)) {
            return;
        }
        const dropPos = info.node.props.pos.split('-');
        // @ts-ignore: next
        const dropPosition: number = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        if (onDrag) {
            onDrag(dropKey, dragKey, dropPosition);
        }
    }
}
