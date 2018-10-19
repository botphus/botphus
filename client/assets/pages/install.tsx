import {Card, Col, Row} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';

import {IReduxConnectProps} from '../interfaces/common';

import {localePkg} from '../common/const';

class Install extends React.Component<IReduxConnectProps> {
    public render() {
        return (
            <Row className="app-welcome" type="flex" align="middle" justify="center">
                <Col span={20} lg={8} md={12}>
                    <Card title={localePkg.Client.Title.Install}>
                        Install
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default connect()(Install);
