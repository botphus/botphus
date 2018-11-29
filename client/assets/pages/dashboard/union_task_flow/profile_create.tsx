import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState, IUnionTaskFlowContentData} from '../../../interfaces/redux';

import {cleanUnionTaskFlowDetail, createUnionTaskFlowData, queryUnionTaskFlowDetailData} from '../../../actions/union_task_flow';
import {localePkg} from '../../../lib/const';
import {parseLocationSearch} from '../../../lib/util';
import {routerHistory} from '../../../router';

import UnionTaskFlowProfileCreateForm from '../../../components/form/union_task_flow_profile_create';

interface IUnionTaskFlowProfileCreateProps extends IReduxConnectProps {
    modal: IModalData;
    unionTaskFlow: IUnionTaskFlowContentData;
}

import Loading from '../../../components/loading';

function mapStateToProps({modal, unionTaskFlow}: IReduxStoreState) {
    return {
        modal,
        unionTaskFlow
    };
}

class DashboardUnionTaskFlowProfileCreatePage extends React.Component<IUnionTaskFlowProfileCreateProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {dispatch, location} = this.props;
        const query = parseLocationSearch(location.search);
        if (query.copyId) {
            dispatch(queryUnionTaskFlowDetailData(query.copyId));
        }
    }
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUnionTaskFlowDetail());
    }
    public render() {
        const {modal, unionTaskFlow} = this.props;
        if (modal.loading) {
            return <Loading />;
        }
        return (
            <div className="app-dashboard-union-task-flow-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.UnionTaskFlow}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <a className="ant-btn" onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </a>
                    </Col>
                </Row>
                <UnionTaskFlowProfileCreateForm onSubmit={this.handleSubmit} defaultValue={unionTaskFlow.detail} loading={modal.loadingForm} />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch} = this.props;
        dispatch(createUnionTaskFlowData(data, (res) => {
            routerHistory.push(`/dashboard/union-task-flow/profile/${res.data}`);
        }));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/union-task-flow/');
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardUnionTaskFlowProfileCreatePage));
