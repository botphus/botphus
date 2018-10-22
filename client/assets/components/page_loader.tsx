import {Col, Icon, Row} from 'antd';
import * as React from 'react';
import * as Loadable from 'react-loadable';

import {welcomePageLayout} from '../lib/const';

class Loading extends React.Component {
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

/**
 * Load component page
 * @param  {[type]} pagePath: string        [description]
 * @return {[type]}           [description]
 */
export default function asyncLoadComponent(pagePath: string): React.ReactNode {
    return Loadable({
        loader: () => import(`../pages/${pagePath}`),
        loading: () => <Loading />
    });
}
