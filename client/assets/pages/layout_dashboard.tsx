import {Layout} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';
const {Sider, Content} = Layout;

import {IContentData, IReduxConnectProps, IReduxStoreState} from '../interfaces/redux';

interface ILayoutDashboardPage extends IReduxConnectProps {
    user: IContentData;
    children?: React.ReactChild;
}

function mapStateToProps({user}: IReduxStoreState) {
    return {
        user
    };
}

class LayoutDashboardPage extends React.Component<ILayoutDashboardPage> {
    public render() {
        const {children} = this.props;
        return (
            <Layout className="app-dashboard">
                <Sider className="app-sidebar">
                    <div className="logo">
                        BOTPHUS
                    </div>
                </Sider>
                <Content>
                    {children}
                </Content>
            </Layout>
        );
    }
}

export default connect(mapStateToProps)(LayoutDashboardPage);
