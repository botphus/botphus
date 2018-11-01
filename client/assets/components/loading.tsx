import {Col, Icon, Row} from 'antd';
import * as React from 'react';

import {welcomePageLayout} from '../lib/const';

export default class Loading extends React.Component {
    public render() {
        return (
            <Row className="app-welcome app-page-loading" type="flex" align="middle" justify="center">
                <Col {...welcomePageLayout}>
                    <div><Icon className="loading" type="robot" /></div>
                    <p className="m-t">LOADING...</p>
                </Col>
            </Row>
        );
    }
}
