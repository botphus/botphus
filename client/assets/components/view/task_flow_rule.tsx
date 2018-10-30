import {Drawer, Icon, Tag, Tree} from 'antd';
import {AntTreeNodeSelectedEvent} from 'antd/lib/tree/Tree';
import * as React from 'react';
const {TreeNode} = Tree;

import {IIndexMap} from '../../interfaces/common';
import {ITaskReportDetailItem, ITaskRuleSaveItem, ITaskRuleTreeItem} from '../../interfaces/task';
import {TaskReportStatus, TaskType} from '../../types/common';

import {localePkg} from '../../lib/const';
import {formatNumber} from '../../lib/format';
import {getTaskItemTreeList} from '../../lib/task';

interface ITaskFlowRuleProps {
    list: ITaskRuleSaveItem[];
    reportMap: IIndexMap<ITaskReportDetailItem>;
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
        const {list, reportMap} = this.props;
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
        const statusCountList: string[] = Object.keys(statusCount);
        let totalPercent: number = 100;
        list.forEach((item) => {
            const curReport: ITaskReportDetailItem = reportMap[item.id] || {};
            statusCount[TaskReportStatus[typeof curReport.status === 'number' ? curReport.status : TaskReportStatus.IGNORE]] += 1;
        });
        // Translate flat data to tree data
        const treeData = getTaskItemTreeList(list);
        const loop = (data: ITaskRuleTreeItem[]) => data.map((item) => {
            const curReport: ITaskReportDetailItem = reportMap[item.index] || {};
            let disabled: boolean = false;
            let $reportStatusIcon;
            switch (curReport.status) {
                case TaskReportStatus.PENDING:
                    $reportStatusIcon = <Icon type="clock-circle" theme="twoTone" />;
                    break;
                case TaskReportStatus.FAILED:
                    $reportStatusIcon = <Icon type="close-circle" theme="twoTone" twoToneColor="#F2F2F2" />;
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
                <div title={typeof curReport.status === 'number' ? localePkg.Enum.TaskReportStatus[TaskReportStatus[curReport.status]] : ''}>
                    <span className="m-r">{$reportStatusIcon}</span>{item.name}({localePkg.Enum.TaskType[TaskType[item.type]]})
                </div>
            );
            if (item.children && item.children.length) {
                return <TreeNode disabled={disabled} key={item.index} title={titleTitle} index={item.index}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode disabled={disabled} key={item.index} title={titleTitle} index={item.index} />;
        });
        return (
            <div>
                <div className="app-task-flow-count">
                    {statusCountList.map((key, index) => {
                        const percent = formatNumber((statusCount[key] / list.length) * 100, 2);
                        if (index !== statusCountList.length - 1) {
                            totalPercent -= percent;
                        }
                        return (
                            <span className="count-item" key={index.toString()}>
                                <span className="percent">{index !== statusCountList.length - 1 ? percent : totalPercent}%</span>
                                <span className="name">{localePkg.Enum.TaskReportStatus[key]}</span>
                                <Tag className="number" closable={false}>{statusCount[key]}/{list.length}</Tag>
                            </span>
                        );
                    })}
                </div>
                <Tree
                    onSelect={this.handleSelect}
                    defaultExpandAll
                    selectedKeys={[selectIndex]}
                    className="app-task-flow-rule m-t"
                >
                    {loop(treeData)}
                </Tree>
                <Drawer
                    title={localePkg.Client.Title.TaskReport}
                    onClose={this.handleUnselect}
                    visible={selectIndex !== ''}
                    width={500}
                >
                    <p>{localePkg.Model.TaskReport.index}: {selectReport.index}</p>
                    <p>{localePkg.Model.TaskReport.status}:
                        {typeof selectReport.status === 'number' ? localePkg.Enum.TaskReportStatus[TaskReportStatus[selectReport.status]] : ''}</p>
                    <p>{localePkg.Model.TaskReport.message}</p>
                    <p>{selectReport.message || '-'}</p>
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