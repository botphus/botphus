import * as React from 'react';
import {connect} from 'react-redux';

import {IContentData, IModalData, IReduxConnectProps, IReduxStoreState} from '../../interfaces/redux';

import {modifyUserData, querySelfData} from '../../actions/user';
import {localePkg} from '../../lib/const';
import {routerHistory} from '../../router';

import ModifyProfileForm from '../../components/form/modify_profile';

interface IUserProfileProps extends IReduxConnectProps {
    modal: IModalData;
    user: IContentData;
}

function mapStateToProps({modal, user}: IReduxStoreState) {
    return {
        modal,
        user
    };
}

class UserProfilePage extends React.Component<IUserProfileProps> {
    public render() {
        const {modal, user} = this.props;
        return (
            <div>
                <h1>{localePkg.Client.Title.Profile}</h1>
                <ModifyProfileForm defaultValue={user.detail} onSubmit={this.handleSubmit} loading={modal.loadingForm} />
            </div>
        );
    }
    private handleSubmit = (data) => {
        const {dispatch} = this.props;
        dispatch(modifyUserData(data, () => {
            if (data.password) {
                routerHistory.push('/login/');
            } else {
                dispatch(querySelfData());
            }
        }));
    }
}

export default connect(mapStateToProps)(UserProfilePage);
