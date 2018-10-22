import {Alert, Layout, Spin} from 'antd';
import * as React from 'react';
import {connect} from 'react-redux';

import {IModalData, IReduxConnectProps, IReduxStoreState} from '../interfaces/redux';

import {updateModel} from '../actions/modal';

interface ILayoutPage extends IReduxConnectProps {
    modal: IModalData;
    children?: React.ReactChild;
}

function mapStateToProps({modal}: IReduxStoreState) {
    return {
        modal
    };
}

class LayoutPage extends React.Component<ILayoutPage> {
    public render() {
        const {modal, children} = this.props;
        let $pageWarn;
        if (!!modal.pageWarn) {
            $pageWarn = (
                <Alert
                    className="m"
                    message={modal.pageWarn}
                    type="warning"
                    closable
                    onClose={this.handleTipClose}
                />
            );
        }
        return (
            <Spin spinning={modal.loading}>
                <Layout className="app-layout">
                    {$pageWarn}
                    {children}
                </Layout>
            </Spin>
        );
    }
    private handleTipClose = () => {
        const {dispatch} = this.props;
        dispatch(updateModel({
            pageWarn: ''
        }));
    }
}

export default connect(mapStateToProps)(LayoutPage);
