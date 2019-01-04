import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {IDetailPageRouteMatchProps, IModalData, IReduxConnectProps, IReduxStoreState, IUserGroupContentData} from '../../../interfaces/redux';

import {cleanUserGroupDetail, createUserGroupData, modifyUserGroupData, queryUserGroupDetailData} from '../../../actions/user_group';
import {localePkg} from '../../../lib/const';
import {routerHistory} from '../../../router';

import UserGroupProfileModifyForm from '../../../components/form/user_group_profile_modify';
import Loading from '../../../components/loading';

interface IUserGroupProfileProps extends IReduxConnectProps {
    modal: IModalData;
    userGroup: IUserGroupContentData;
}

function mapStateToProps({modal, userGroup}: IReduxStoreState) {
    return {
        modal,
        userGroup,
    };
}

class DashboardUserGroupProfilePage extends React.Component<IUserGroupProfileProps & RouteComponentProps<IDetailPageRouteMatchProps>> {
    public componentDidMount() {
        const {dispatch, match} = this.props;
        // Check is create
        if (match.params.id !== 'create') {
            dispatch(queryUserGroupDetailData(match.params.id));
        }
    }
    public componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(cleanUserGroupDetail());
    }
    public render() {
        const {modal, match, userGroup} = this.props;
        // Check loading state
        if (modal.loading) {
            return <Loading />;
        }
        return (
            <div className="app-dashboard-user-group-create">
                <Row>
                    <Col span={12}>
                        <h1>{localePkg.Client.Title.UserGroup}</h1>
                    </Col>
                    <Col className="text-right p-t-sm" span={12}>
                        <a className="ant-btn" onClick={this.handleCancel}>
                            <Icon type="left-square" theme="filled" className="m-r-sm" />{localePkg.Client.Action.cancel}
                        </a>
                    </Col>
                </Row>
                <UserGroupProfileModifyForm
                    defaultValue={userGroup.detail} onSubmit={this.handleSubmit} loading={modal.loadingForm} isCreate={match.params.id === 'create'}
                />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch, match} = this.props;
        const isCreate = match.params.id === 'create';
        const dispatchFunc = isCreate ? createUserGroupData : modifyUserGroupData;
        const sendData = isCreate ? data : {
            modifyId: match.params.id,
            ...data
        };
        dispatch(dispatchFunc(sendData, () => {
            this.handleCancel();
        }));
    }
    private handleCancel = () => {
        routerHistory.push('/dashboard/user-group/');
    }
}

export default withRouter<RouteComponentProps<IDetailPageRouteMatchProps>>(connect(mapStateToProps)(DashboardUserGroupProfilePage));
