import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState, IUserContentData} from '../../../interfaces/redux';

import {cleanUserDetail, modifyUserData, postCreateUserData, queryUserDetailData} from '../../../actions/user';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import UserProfileModifyForm from '../../../components/form/user_profile_modify';
import Loading from '../../../components/loading';

interface IUserProfileProps extends IReduxConnectProps {
    modal: IModalData;
    user: IUserContentData;
}

function mapStateToProps({modal, user}: IReduxStoreState) {
    return {
        modal,
        user
    };
}

class DashboardUserProfilePage extends React.Component<IUserProfileProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {dispatch, match} = this.props;
        // Check is create
        if (match.params.id !== 'create') {
            dispatch(queryUserDetailData(match.params.id));
        }
    }
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUserDetail());
    }
    public render() {
        const {modal, match, user} = this.props;
        // Check loading state
        if (modal.loading) {
            return <Loading />;
        }
        return (
            <div className="app-dashboard-user-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.User}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <a className="ant-btn" onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </a>
                    </Col>
                </Row>
                <UserProfileModifyForm
                    defaultValue={user.detail} onSubmit={this.handleSubmit} loading={modal.loadingForm} permission={true} isCreate={match.params.id === 'create'}
                />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch, match} = this.props;
        const isCreate = match.params.id === 'create';
        const dispatchFunc = isCreate ? postCreateUserData : modifyUserData;
        const sendData = isCreate ? data : {
            modifyId: match.params.id,
            ...data
        };
        dispatch(dispatchFunc(sendData, () => {
            this.handleCancel();
        }));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/user/');
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardUserProfilePage));
