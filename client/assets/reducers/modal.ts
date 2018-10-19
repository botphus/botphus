// Import action
import {IActionData, IModelData} from '../interfaces/common';
import {ActionType} from '../types/action';

const INIT_STATE: IModelData = {
    loading: false, // Fetch data loading
    loadingForm: false, // Form submit loading
    loadingPage: false, // Page change loading
    loadingTable: false, // Loading table
    pageWarn: '' // page warn
};

export default function(state = INIT_STATE, action: IActionData<IModelData>) {
    switch (action.type) {
    case ActionType.UPDATE_MODAL:
        return Object.assign({}, state, action.data);
    default:
        return state;
    }
}
