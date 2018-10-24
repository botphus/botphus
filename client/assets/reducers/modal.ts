// Import action
import {IActionData, IModalData} from '../interfaces/redux';

import {ActionType} from '../types/redux';

const INIT_STATE: IModalData = {
    loading: false, // Fetch data loading
    loadingForm: false, // Form submit loading
    loadingPage: false, // Page change loading
    loadingTable: false, // Loading table
    pageWarn: '' // page warn
};

export default function(state = INIT_STATE, action: IActionData<IModalData>) {
    switch (action.type) {
    case ActionType.UPDATE_MODAL:
        return {
            ...state,
            ...action.data
        };
    default:
        return state;
    }
}
