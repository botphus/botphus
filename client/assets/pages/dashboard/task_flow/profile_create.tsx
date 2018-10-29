import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState} from '../../../interfaces/redux';

import {postCreateTaskFlowData} from '../../../actions/task_flow';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import TaskFlowCreateProfileForm from '../../../components/form/task_flow_create_profile';

interface ITaskFlowProfileCreateProps extends IReduxConnectProps {
    modal: IModalData;
}

function mapStateToProps({modal}: IReduxStoreState) {
    return {
        modal
    };
}

class DashboardTaskFlowCreatePage extends React.Component<ITaskFlowProfileCreateProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public render() {
        const {modal} = this.props;
        return (
            <div className="app-dashboard-task-flow-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.TaskFlow}</h1>
                    </Col>
                    <Col className="text-right" span={12}>
                        <a className="ant-btn" onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </a>
                    </Col>
                </Row>
                <TaskFlowCreateProfileForm onSubmit={this.handleSubmit} defaultValue={{}} loading={modal.loadingForm} />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch} = this.props;
        dispatch(postCreateTaskFlowData(data, (res) => {
            routerHistory.push(`/dashboard/task-flow/profile/${res.data}`);
        }));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/task-flow/');
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardTaskFlowCreatePage));
