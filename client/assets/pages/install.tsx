import {Card, Col, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';

import {IModalData, IReduxConnectProps, IReduxStoreState} from '../interfaces/redux';

import {postInstallData} from '../actions/user';
import {localePkg, welcomePageLayout} from '../lib/const';
import {routerHistory} from '../router';

import UserProfileModifyForm from '../components/form/user_profile_modify';

interface IInstallProps extends IReduxConnectProps {
    modal: IModalData;
}

function mapStateToProps({modal}: IReduxStoreState) {
    return {
        modal
    };
}

class InstallPage extends React.Component<IInstallProps> {
    public render() {
        const {modal} = this.props;
        return (
            <Row className="app-welcome" type="flex" align="middle" justify="center">
                <Col {...welcomePageLayout}>
                    <Card title={localePkg.Client.Title.Install}>
                        <UserProfileModifyForm defaultValue={{}} onSubmit={this.handleSubmit} loading={modal.loadingForm} isCreate={true} />
                    </Card>
                </Col>
            </Row>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch} = this.props;
        dispatch(postInstallData(data, () => {
            routerHistory.push('/login/');
        }));
    }
}

export default connect(mapStateToProps)(InstallPage);
