import {Drawer, Icon, Progress, Tree} from 'antd';
import {AntTreeNodeSelectedEvent} from 'antd/lib/tree/Tree';
import * as React from 'react';
const {TreeNode} = Tree;

import {IIndexMap} from '../../interfaces/common';
import {ITaskReportDetailItem, ITaskRuleSaveItem, ITaskRuleTreeItem} from '../../interfaces/task';
import {TaskReportStatus, TaskType} from '../../types/common';

import {localePkg} from '../../lib/const';
import {formatNumber} from '../../lib/format';
import {getTaskItemTreeList} from '../../lib/task';

import TaskReport from './task_report';

interface ITaskFlowRuleProps {
    list: ITaskRuleSaveItem[];
    reportMap: IIndexMap<ITaskReportDetailItem>;
    prefix?: string;
}

interface ITaskFlowRuleState {
    selectIndex: string;
}

export default class TaskFlowRule extends React.Component<ITaskFlowRuleProps, ITaskFlowRuleState> {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: ''
        };
    }
    public render() {
        const {selectIndex} = this.state;
        const {list, reportMap, prefix} = this.props;
        if (list.length === 0) {
            return null;
        }
        const statusCount: IIndexMap<number> = {
            FAILED: 0,
            IGNORE: 0,
            ONGOING: 0,
            PENDING: 0,
            SUCCESS: 0,
        };
        const selectReport: ITaskReportDetailItem = selectIndex ? reportMap[selectIndex] : {};
        // Translate flat data to tree data
        const treeData = getTaskItemTreeList(list);
        const loop = (data: ITaskRuleTreeItem[]) => data.map((item) => {
            const index = `${prefix || ''}${item.index}`;
            const curReport: ITaskReportDetailItem = reportMap[index] || {};
            statusCount[TaskReportStatus[typeof curReport.status === 'number' ? curReport.status : TaskReportStatus.IGNORE]] += 1;
            let disabled: boolean = false;
            let $reportStatusIcon;
            switch (curReport.status) {
                case TaskReportStatus.PENDING:
                    $reportStatusIcon = <Icon type="clock-circle" theme="twoTone" />;
                    break;
                case TaskReportStatus.FAILED:
                    $reportStatusIcon = <Icon type="close-circle" />;
                    break;
                case TaskReportStatus.SUCCESS:
                    $reportStatusIcon = <Icon type="check-circle" theme="twoTone" twoToneColor="#52C41A" />;
                    break;
                case TaskReportStatus.ONGOING:
                    $reportStatusIcon = <Icon type="sync" spin />;
                    break;
                default:
                    $reportStatusIcon = <Icon type="minus-circle" theme="twoTone" twoToneColor="#52C41A" />;
                    disabled = true;
            }
            const titleTitle = (
                <div
                    title={typeof curReport.status === 'number' ? localePkg.Enum.TaskReportStatus[TaskReportStatus[curReport.status]] : ''}
                    className={curReport.status === TaskReportStatus.FAILED ? 'text-error' : ''}>
                    <span className="m-r">{$reportStatusIcon}</span>{item.name}({localePkg.Enum.TaskType[TaskType[item.type]]})
                </div>
            );
            if (item.children && item.children.length) {
                return <TreeNode disabled={disabled} key={index} title={titleTitle} index={index}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode disabled={disabled} key={index} title={titleTitle} index={index} />;
        });
        const $children = loop(treeData);
        const progressPercent = formatNumber((statusCount.SUCCESS / list.length) * 100, 2);
        return (
            <div>
                <Progress
                    percent={progressPercent}
                    status={statusCount.FAILED > 0 ? 'exception' : (progressPercent === 100 ? 'success' : 'active')} />
                <Tree
                    onSelect={this.handleSelect}
                    defaultExpandAll
                    selectedKeys={[selectIndex]}
                    className="app-task-flow-rule m-t"
                >
                    {$children}
                </Tree>
                <Drawer
                    title={localePkg.Client.Title.TaskReport}
                    onClose={this.handleUnselect}
                    visible={selectIndex !== ''}
                    width={500}
                >
                    <TaskReport report={selectReport} />
                </Drawer>
            </div>
        );
    }
    private handleSelect = (_checkedKeys, info: AntTreeNodeSelectedEvent) => {
        this.setState({
            selectIndex: info.node.props.index
        });
    }
    private handleUnselect = () => {
        this.setState({
            selectIndex: ''
        });
    }
}
