import {Button, Col, Icon, Row, Tabs} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
const {TabPane} = Tabs;

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState} from '../../../interfaces/redux';
import {IUnionTaskFlowContentData} from '../../../interfaces/redux';

import {queryUnionTaskFlowDetailData, startUnionTaskFlowData} from '../../../actions/union_task_flow';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import TaskFlowBtn from '../../../components/btn/task_flow';
import UnionTaskFlowInfo from '../../../components/view/union_task_flow_info';
import UnionTaskFlowRule from '../../../components/view/union_task_flow_rule';

interface ITaskFlowProfileProps extends IReduxConnectProps {
    modal: IModalData;
    unionTaskFlow: IUnionTaskFlowContentData;
}

function mapStateToProps({modal, unionTaskFlow}: IReduxStoreState) {
    return {
        modal,
        unionTaskFlow
    };
}

class DashboardUnionTaskFlowProfilePage extends React.Component<ITaskFlowProfileProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {match} = this.props;
        this.handleGetDetail(match.params.id);
    }
    public render() {
        const {unionTaskFlow} = this.props;
        return (
            <div className="app-dashboard-union-task-flow-profile">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.UnionTaskFlow}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <TaskFlowBtn status={unionTaskFlow.detail.status} onStart={this.handleStartTask} />
                        <Button onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </Button>
                    </Col>
                </Row>
                <Tabs>
                    <TabPane tab={localePkg.Client.Title.TaskFlowRule} key="rule">
                        {unionTaskFlow.detail._id && unionTaskFlow.detail.unionTaskDetail && unionTaskFlow.detail.taskDetailMap && unionTaskFlow.detail.taskReportMap ? (
                            <UnionTaskFlowRule
                                taskItems={unionTaskFlow.detail.unionTaskDetail.taskItems || []}
                                taskDetailMap={unionTaskFlow.detail.taskDetailMap}
                                reportMap={unionTaskFlow.detail.taskReportMap}
                            />
                        ) : null}
                    </TabPane>
                    <TabPane tab={localePkg.Client.Title.TaskFlowBasic} key="basic"><UnionTaskFlowInfo detail={unionTaskFlow.detail} /></TabPane>
                </Tabs>
            </div>
        );
    }
    private handleStartTask = () => {
        const {dispatch, unionTaskFlow} = this.props;
        if (!unionTaskFlow.detail._id) {
            return;
        }
        const id = unionTaskFlow.detail._id;
        dispatch(startUnionTaskFlowData(id));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/union-task-flow/');
    }
    private handleGetDetail = (taskFlowId: string) => {
        const {dispatch} = this.props;
        dispatch(queryUnionTaskFlowDetailData(taskFlowId));
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardUnionTaskFlowProfilePage));
