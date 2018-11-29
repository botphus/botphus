import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState, IUnionTaskContentData} from '../../../interfaces/redux';

import {cleanUnionTaskDetail, createUnionTaskData, modifyUnionTaskData, queryUnionTaskDetailData} from '../../../actions/union_task';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import UnionTaskProfileModifyForm from '../../../components/form/union_task_profile_modify';
import Loading from '../../../components/loading';

interface IUnionTaskProfileProps extends IReduxConnectProps {
    modal: IModalData;
    unionTask: IUnionTaskContentData;
}

function mapStateToProps({modal, unionTask}: IReduxStoreState) {
    return {
        modal,
        unionTask,
    };
}

class DashboardUnionTaskProfilePage extends React.Component<IUnionTaskProfileProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {dispatch, match} = this.props;
        // Check is create
        if (match.params.id !== 'create') {
            dispatch(queryUnionTaskDetailData(match.params.id));
        }
    }
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUnionTaskDetail());
    }
    public render() {
        const {modal, match, unionTask} = this.props;
        // Check loading state
        if (modal.loading) {
            return <Loading />;
        }
        return (
            <div className="app-dashboard-union-task-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.UnionTask}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <a className="ant-btn" onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </a>
                    </Col>
                </Row>
                <UnionTaskProfileModifyForm
                    defaultValue={unionTask.detail} onSubmit={this.handleSubmit} loading={modal.loadingForm} isCreate={match.params.id === 'create'}
                />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch, match} = this.props;
        const isCreate = match.params.id === 'create';
        const dispatchFunc = isCreate ? createUnionTaskData : modifyUnionTaskData;
        const sendData = isCreate ? data : {
            modifyId: match.params.id,
            ...data
        };
        dispatch(dispatchFunc(sendData, () => {
            this.handleCancel();
        }));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/union-task/');
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardUnionTaskProfilePage));
