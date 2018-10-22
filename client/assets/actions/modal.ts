import {IActionData, IModalUpdateData} from '../interfaces/redux';
import {ActionType} from '../types/redux';

// actions
/**
 * Update model data
 * @param  {IModalUpdateData}              data Update data
 * @return {IActionData<IModalUpdateData>}      Action
 */
export function updateModel(data: IModalUpdateData): IActionData<IModalUpdateData> {
    return {
        data,
        type: ActionType.UPDATE_MODAL
    };
}
