import {IActionData, IModelData} from '../interfaces/common';
import {ActionType} from '../types/action';

// actions
/**
 * Update model data
 * @param {IModelData} data Update data
 */
export function updateModel(data: IModelData): IActionData<IModelData> {
    return {
        data,
        type: ActionType.UPDATE_MODAL
    };
}
