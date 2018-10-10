import {Schema} from 'mongoose';

import {Database} from '../models/';

import {IDatabaseModel, IDatabaseSearchModel} from '../interfaces/model';

import {DatabaseType} from '../types/database';
import {strLength} from '../types/rules';

/**
 * Query database info config by ID
 * @param  {Schema.Types.ObjectId}   databaseId Database ID
 * @param  {string}                  fields     Field list
 * @return {Promise<IDatabaseModel>}            Promise with Database Info
 */
export function queryDatabaseById(databaseId: Schema.Types.ObjectId, fields: string = null): Promise<IDatabaseModel> {
    return Database.findById(databaseId, fields).exec();
}

/**
 * Query database list
 * @param  {IUserSearchModel}                    query    Query condition
 * @param  {number}                              page     Page
 * @param  {number}                              pageSize Page size
 * @param  {string}                              fields   Field list
 * @return {Promise<[number, IDatabaseModel[]]>}          Promise with total number & database info list
 */
export function queryDatabaseList(query: IDatabaseSearchModel, page: number, pageSize: number, fields: string): Promise<[number, IDatabaseModel[]]> {
    const condition: any = {};
    if (query.name && query.name.length >= strLength[0] && query.name.length <= strLength[0]) {
        condition.name = {
            $regex: query.name
        };
    }
    if (query.type && DatabaseType[query.type]) {
        condition.type = query.type;
    }
    return Promise.all([
        Database.count(condition).exec(),
        Database.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Createa database info
 * @param  {IDatabaseModel}          databaseData Database data
 * @return {Promise<IDatabaseModel>}              Promise with database Info
 */
export function createDatabase(databaseData: IDatabaseModel): Promise<IDatabaseModel> {
    const database = Object.assign(new Database(), databaseData);
    return database.save();
}

/**
 * Modify database info
 * @param  {Schema.Types.ObjectId}   databaseId   Database ID
 * @param  {IDatabaseModel}          databaseData Database data
 * @return {Promise<IDatabaseModel>}              Promise with database Info
 */
export function modifyDatabaseById(databaseId: Schema.Types.ObjectId, databaseData: IDatabaseModel): Promise<IDatabaseModel> {
    return Database.findByIdAndUpdate(databaseId, databaseData).exec();
}
