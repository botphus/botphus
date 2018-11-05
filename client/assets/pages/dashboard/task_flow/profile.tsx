import {Button, Col, Icon, Row, Tabs, Tooltip} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
const {TabPane} = Tabs;

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState} from '../../../interfaces/redux';
import {ITaskFlowContentData} from '../../../interfaces/redux';
import {TaskFlowStatus} from '../../../types/common';

import {queryTaskFlowDetailData, startTaskFlowData} from '../../../actions/task_flow';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import TaskFlowInfo from '../../../components/view/task_flow_info';
import TaskFlowRule from '../../../components/view/task_flow_rule';

interface ITaskFlowProfileProps extends IReduxConnectProps {
    modal: IModalData;
    taskFlow: ITaskFlowContentData;
}

function mapStateToProps({modal, taskFlow}: IReduxStoreState) {
    return {
        modal,
        taskFlow
    };
}

class DashboardTaskFlowProfilePage extends React.Component<ITaskFlowProfileProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {match} = this.props;
        this.handleGetDetail(match.params.id);
    }
    public render() {
        const {taskFlow} = this.props;
        let $startBtn;
        switch (taskFlow.detail.status) {
            case TaskFlowStatus.CLOSE:
                $startBtn = (
                    <Tooltip placement="topLeft" title={localePkg.Service.TaskFlow.startForbidden}>
                        <Button type="primary" className="m-r" disabled>
                            <Icon type="close-circle" className="m-r-sm" theme="outlined" />
                            {localePkg.Client.Action.startTaskFlow}
                        </Button>
                    </Tooltip>
                );
                break;
            case TaskFlowStatus.SUCCESS:
                $startBtn = (
                    <Button type="primary" className="m-r" onClick={this.handleStartTask}>
                        <Icon type="check-circle" className="m-r-sm" theme="outlined" />
                        {localePkg.Client.Action.startTaskFlow}
                    </Button>
                );
                break;
            case TaskFlowStatus.FAILED:
                $startBtn = (
                    <Button type="danger" className="m-r" onClick={this.handleStartTask}>
                        <Icon type="close-circle" className="m-r-sm" theme="outlined" />
                        {localePkg.Client.Action.restartTaskFlow}
                    </Button>
                );
                break;
            case TaskFlowStatus.ONGOING:
                $startBtn = (
                    <Button type="primary" className="m-r" disabled>
                        <Icon type="loading" className="m-r-sm" theme="outlined" />
                        {localePkg.Client.Action.startTaskFlow}
                    </Button>
                );
                break;
            default:
                $startBtn = (
                    <Button type="primary" className="m-r" onClick={this.handleStartTask}>
                        <Icon type="pause-circle" className="m-r-sm" theme="outlined" />
                        {localePkg.Client.Action.startTaskFlow}
                    </Button>
                );
        }
        return (
            <div className="app-dashboard-task-flow-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.TaskFlow}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        {$startBtn}
                        <Button onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </Button>
                    </Col>
                </Row>
                <Tabs>
                    <TabPane tab={localePkg.Client.Title.TaskFlowRule} key="rule">
                        <TaskFlowRule
                            list={taskFlow.detail.taskDetail && taskFlow.detail.taskDetail.ruleItems ? taskFlow.detail.taskDetail.ruleItems : []}
                            reportMap={taskFlow.detail.taskReportMap || {}}
                        />
                    </TabPane>
                    <TabPane tab={localePkg.Client.Title.TaskFlowBasic} key="basic"><TaskFlowInfo detail={taskFlow.detail} /></TabPane>
                </Tabs>
            </div>
        );
    }
    private handleStartTask = () => {
        const {dispatch, taskFlow} = this.props;
        if (!taskFlow.detail._id) {
            return;
        }
        const id = taskFlow.detail._id;
        dispatch(startTaskFlowData(id));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/task-flow/');
    }
    private handleGetDetail = (taskFlowId: string) => {
        const {dispatch} = this.props;
        dispatch(queryTaskFlowDetailData(taskFlowId));
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardTaskFlowProfilePage));
