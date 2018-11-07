import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState, ITaskFlowContentData} from '../../../interfaces/redux';

import {cleanTaskFlowDetail, createTaskFlowData, queryTaskFlowDetailData} from '../../../actions/task_flow';
import {localePkg} from '../../../lib/const';
import {parseLocationSearch} from '../../../lib/util';
import {routerHistory} from '../../../router';

import TaskFlowProfileCreateForm from '../../../components/form/task_flow_profile_create';

interface ITaskFlowProfileCreateProps extends IReduxConnectProps {
    modal: IModalData;
    taskFlow: ITaskFlowContentData;
}

import Loading from '../../../components/loading';

function mapStateToProps({modal, taskFlow}: IReduxStoreState) {
    return {
        modal,
        taskFlow
    };
}

class DashboardTaskFlowProfileCreatePage extends React.Component<ITaskFlowProfileCreateProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {dispatch, location} = this.props;
        const query = parseLocationSearch(location.search);
        if (query.copyId) {
            dispatch(queryTaskFlowDetailData(query.copyId));
        }
    }
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanTaskFlowDetail());
    }
    public render() {
        const {modal, taskFlow} = this.props;
        if (modal.loading) {
            return <Loading />;
        }
        return (
            <div className="app-dashboard-task-flow-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.TaskFlow}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <a className="ant-btn" onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </a>
                    </Col>
                </Row>
                <TaskFlowProfileCreateForm onSubmit={this.handleSubmit} defaultValue={taskFlow.detail} loading={modal.loadingForm} />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch} = this.props;
        dispatch(createTaskFlowData(data, (res) => {
            routerHistory.push(`/dashboard/task-flow/profile/${res.data}`);
        }));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/task-flow/');
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardTaskFlowProfileCreatePage));
