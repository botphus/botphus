import * as React from 'react';
import {connect} from 'react-redux';

import {IModalData, IReduxConnectProps, IReduxStoreState, IUserContentData} from '../../interfaces/redux';

import {modifyUserData, queryUserOwnerData} from '../../actions/user';
import {localePkg} from '../../lib/const';
import {routerHistory} from '../../router';

import UserProfileModifyForm from '../../components/form/user_profile_modify';

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

class DashboardProfilePage extends React.Component<IUserProfileProps> {
    public render() {
        const {modal, user} = this.props;
        return (
            <div className="app-dashboard-profile">
                <h1>{localePkg.Client.Title.Profile}</h1>
                <UserProfileModifyForm defaultValue={user.owner} onSubmit={this.handleSubmit} loading={modal.loadingForm} isCreate={false} />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch} = this.props;
        dispatch(modifyUserData(data, () => {
            if (data.password) {
                routerHistory.push('/login/');
            } else {
                dispatch(queryUserOwnerData());
            }
        }));
    }
}

export default connect(mapStateToProps)(DashboardProfilePage);
