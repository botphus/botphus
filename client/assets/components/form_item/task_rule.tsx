import {Icon, message, Popconfirm, Tree} from 'antd';
import {AntTreeNodeDropEvent} from 'antd/lib/tree/Tree';
import * as React from 'react';
const {TreeNode} = Tree;

import {IIndexMap} from '../../interfaces/common';
import {ITaskRuleSaveItem, ITaskRuleTreeItem} from '../../interfaces/task';
import {TaskType} from '../../types/common';

import {localePkg} from '../../lib/const';
import {getTaskItemRelatedIds, getTaskItemTreeList} from '../../lib/task';

interface ITaskRuleProps {
    value: ITaskRuleSaveItem[];
    checkValue?: string[];
    onCheck?: (checkedKeys) => void;
    onChange?: (id: number, parentId: number) => void;
    onRemove?: (levelMap: IIndexMap<number>) => void;
    // before: dropPosition = -1
    // inset: dropPosition = 0
    // after: dropPosition = 1
    onDrag?: (dropKey: number, dragKey: number, levelMap: IIndexMap<number>, dropPosition: number, dropId?: number) => void;
}

export default class TaskRule extends React.Component<ITaskRuleProps> {
    public render() {
        const {checkValue, value, onChange, onDrag, onRemove, onCheck} = this.props;
        // Translate flat data to tree data
        const treeData = getTaskItemTreeList(value);
        const loop = (data: ITaskRuleTreeItem[]) => data.map((item) => {
            const titleTitle = (
                <div>
                    {item.name}({localePkg.Enum.TaskType[TaskType[item.type]]})
                    {/* action: create */}
                    {onChange && item.type === TaskType.TYPE_EVENT ? (
                        <Icon title={localePkg.Client.Action.create} className="m-l" type="plus-square" theme="filled" onClick={() => onChange(0, item.id)} />
                    ) : null}
                    {/* action: modify */}
                    {onChange ? (
                        <Icon title={localePkg.Client.Action.modify} className="m-l" type="edit" theme="filled" onClick={() => onChange(item.id, item.pid)} />
                    ) : null}
                    {/* action: remove */}
                    {onRemove ? (
                        <Popconfirm title={localePkg.Client.Help.removeAction} onConfirm={() => this.handleRemove(item)}>
                            <Icon title={localePkg.Client.Action.remove} className="m-l" type="delete" theme="filled" />
                        </Popconfirm>
                    ) : null}
                </div>
            );
            if (item.children && item.children.length) {
                return <TreeNode key={item.index} title={titleTitle} data={item}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={item.index} title={titleTitle} data={item} />;
        });
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
                {loop(treeData)}
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
        const dropData: ITaskRuleTreeItem = info.node.props.data;
        const dragData: ITaskRuleTreeItem = info.dragNode.props.data;
        // @ts-ignore: next
        const isSort: boolean = info.dropToGap;
        if (!isSort && !(dropData && dropData.type === TaskType.TYPE_EVENT)) {
            return message.error(localePkg.Client.Help.taskRuleDragError);
        }
        const levelMap = {};
        let curLevel = 0;
        let parentPid = 0;
        // If is sort
        if (isSort) {
            parentPid = dropData.pid;
            curLevel = dropData.level;
        } else {
            curLevel = dropData.level + 1;
            parentPid = parseInt(dropKey, 10);
        }
        getTaskItemRelatedIds(levelMap, dragData, curLevel);
        if (onDrag) {
            onDrag(parentPid, parseInt(dragKey, 10), levelMap, dropPosition, dropData.id);
        }
    }
    private handleRemove = (item: ITaskRuleTreeItem) => {
        const {onRemove} = this.props;
        const levelMap = {};
        getTaskItemRelatedIds(levelMap, item);
        if (onRemove) {
            onRemove(levelMap);
        }
    }
}
