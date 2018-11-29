import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {IConnectionContentData, IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState} from '../../../interfaces/redux';

import {cleanConnectionDetail, createConnectionData, modifyConnectionData, queryConnectionDetailData} from '../../../actions/connection';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import ConnectionProfileModifyForm from '../../../components/form/connection_profile_modify';
import Loading from '../../../components/loading';

interface IConnectionProfileProps extends IReduxConnectProps {
    modal: IModalData;
    connection: IConnectionContentData;
}

function mapStateToProps({modal, connection}: IReduxStoreState) {
    return {
        connection,
        modal,
    };
}

class DashboardConnectionProfilePage extends React.Component<IConnectionProfileProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {dispatch, match} = this.props;
        // Check is create
        if (match.params.id !== 'create') {
            dispatch(queryConnectionDetailData(match.params.id));
        }
    }
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanConnectionDetail());
    }
    public render() {
        const {modal, match, connection} = this.props;
        // Check loading state
        if (modal.loading) {
            return <Loading />;
        }
        return (
            <div className="app-dashboard-connection-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.Connection}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <a className="ant-btn" onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </a>
                    </Col>
                </Row>
                <ConnectionProfileModifyForm
                    defaultValue={connection.detail} onSubmit={this.handleSubmit} loading={modal.loadingForm} isCreate={match.params.id === 'create'}
                />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch, match} = this.props;
        const isCreate = match.params.id === 'create';
        const dispatchFunc = isCreate ? createConnectionData : modifyConnectionData;
        const sendData = isCreate ? data : {
            modifyId: match.params.id,
            ...data
        };
        dispatch(dispatchFunc(sendData, () => {
            this.handleCancel();
        }));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/connection/');
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardConnectionProfilePage));
