import {Button, Col, Icon, Row, Tabs} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
const {TabPane} = Tabs;

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState} from '../../../interfaces/redux';
import {ITaskFlowContentData} from '../../../interfaces/redux';

import {queryTaskFlowDetailData, startTaskFlowData} from '../../../actions/task_flow';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import TaskFlowBtn from '../../../components/btn/task_flow';
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
        return (
            <div className="app-dashboard-task-flow-profile">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.TaskFlow}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <TaskFlowBtn status={taskFlow.detail.status} onStart={this.handleStartTask} />
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
