import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState, ITaskContentData} from '../../../interfaces/redux';

import {cleanTaskDetail, createTaskData, modifyTaskData, queryTaskDetailData} from '../../../actions/task';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import TaskProfileModifyForm from '../../../components/form/task_profile_modify';
import Loading from '../../../components/loading';

interface ITaskProfileProps extends IReduxConnectProps {
    modal: IModalData;
    task: ITaskContentData;
}

function mapStateToProps({modal, task}: IReduxStoreState) {
    return {
        modal,
        task,
    };
}

class DashboardTaskProfilePage extends React.Component<ITaskProfileProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {dispatch, match} = this.props;
        // Check is create
        if (match.params.id !== 'create') {
            dispatch(queryTaskDetailData(match.params.id));
        }
    }
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanTaskDetail());
    }
    public render() {
        const {modal, match, task} = this.props;
        // Check loading state
        if (modal.loading) {
            return <Loading />;
        }
        return (
            <div className="app-dashboard-task-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.Task}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <a className="ant-btn" onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </a>
                    </Col>
                </Row>
                <TaskProfileModifyForm
                    defaultValue={task.detail} onSubmit={this.handleSubmit} loading={modal.loadingForm} isCreate={match.params.id === 'create'}
                />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch, match} = this.props;
        const isCreate = match.params.id === 'create';
        const dispatchFunc = isCreate ? createTaskData : modifyTaskData;
        const sendData = isCreate ? data : {
            modifyId: match.params.id,
            ...data
        };
        dispatch(dispatchFunc(sendData, () => {
            this.handleCancel();
        }));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/task/');
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardTaskProfilePage));
