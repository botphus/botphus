import {Col, Icon, Row} from 'antd';
import * as React from 'react';

import {welcomePageLayout} from '../lib/const';

class NotFoundPage extends React.Component {
    public render() {
        return (
            <Row className="app-welcome app-tip" type="flex" align="middle" justify="center">
                <Col {...welcomePageLayout}>
                    <div className="icon"><Icon type="stop" theme="outlined" /></div>
                    <p className="m-t text">404 NOT FOUND</p>
                </Col>
            </Row>
        );
    }
}

export default NotFoundPage;
