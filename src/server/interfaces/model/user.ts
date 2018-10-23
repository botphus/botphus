import {Document, Schema} from 'mongoose';

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
