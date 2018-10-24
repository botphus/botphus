import {Document, Schema} from 'mongoose';

/**
 * Return data
 */
/**
 * User list item
 */
export interface IUserListItem {
    _id?: string;
    email?: string;
    nickname?: string;
    permission?: number;
}

/**
 * User detail
 */
export interface IUserDetailItem extends IUserListItem {
    enable?: boolean;
}

/**
 * Session
 */
export interface IUserSession {
    id?: string;
    email?: string;
    nickname?: string;
    permission?: number;
}

/**
 * User model
 */
export interface IUserModel extends Document {
    email: string;
    nickname: string;
    permission: number; // Binary digit, like 0b010,0b001, set user type: permission
    password: string;
    enable: boolean;
}

/**
 * User refer model
 */
export interface IUserReferModel {
    _id: Schema.Types.ObjectId;
    nickname: string;
}

/**
 * User refer map
 */
export interface IUserReferMap {
    [index: string]: IUserReferModel;
}

/**
 * Create user model
 */
export interface IUserCreateModel extends Document {
    email: string;
    nickname: string;
    permission: number; // Binary digit, like 0b010,0b001, set user type: permission
    password: string;
}

/**
 * Modify user model
 */
export interface IUserModifyModel extends Document {
    email?: string;
    nickname?: string;
    permission?: number;
    enable?: boolean;
    password?: string;
}

/**
 * Search user model
 */
export interface IUserSearchModel extends Document {
    email?: string;
    nickname?: string;
    enable?: boolean;
}
