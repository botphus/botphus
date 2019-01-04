import {Schema} from 'mongoose';

import {IModifyDateModel} from './';
import {IUserReferModel} from './user';

/**
 * Return data
 */
/**
 * User list item
 */
export interface IUserGroupListItem {
    _id?: string;
    name?: string;
}

/**
 * User detail
 */
export interface IUserGroupDetailItem extends IUserGroupListItem {
    members?: IUserReferModel[];
}

/**
 * User group model
 */
export interface IUserGroupModel extends IModifyDateModel {
    name: string;
    members: Schema.Types.ObjectId[];
}

/**
 * User group model with user refer info
 */
export interface IUserGroupReferModel {
    name: string;
    members: IUserReferModel[];
}

/**
 * Modify user group model
 */
export interface IUserGroupModifyModel {
    name?: string;
    members?: Schema.Types.ObjectId[];
}

/**
 * Search user group model
 */
export interface IUserGroupSearchModel {
    name?: string;
}
