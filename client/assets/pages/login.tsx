import {Card, Col, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';

import {IModalData, IReduxConnectProps, IReduxStoreState} from '../interfaces/redux';

import {postLoginData} from '../actions/user';
import {authLogin, localePkg, welcomePageLayout} from '../lib/const';
import {routerHistory} from '../router';

import LoginForm from '../components/form/login';

interface ILoginProps extends IReduxConnectProps {
    modal: IModalData;
}

function mapStateToProps({modal}: IReduxStoreState) {
    return {
        modal
    };
}

class LoginPage extends React.Component<ILoginProps> {
    public render() {
        const {modal} = this.props;
        return (
            <Row className="app-welcome" type="flex" align="middle" justify="center">
                <Col {...welcomePageLayout}>
                    <Card title={localePkg.Client.Title.Login}>
                        <LoginForm defaultValue={{}} onSubmit={this.handleSubmit} loading={modal.loadingForm} authLogin={authLogin} />
                    </Card>
                </Col>
            </Row>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch} = this.props;
        dispatch(postLoginData(data, () => {
            routerHistory.push('/dashboard/');
        }));
    }
}

export default connect(mapStateToProps)(LoginPage);
