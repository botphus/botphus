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
 * User group refer model
 */
export interface IUserGroupReferModel {
    _id: Schema.Types.ObjectId;
    name: string;
}

/**
 * User group model with user refer info
 */
export interface IUserGroupReferUserModel {
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
