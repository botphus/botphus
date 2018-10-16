import {Schema} from 'mongoose';

import {Connection} from '../models/';

import {IConnectionModel, IConnectionSearchModel} from '../interfaces/model';

import {ConnectionType} from '../types/database';
import {strLength} from '../types/rules';

/**
 * Query database info config by ID
 * @param  {Schema.Types.ObjectId}   databaseId Connection ID
 * @param  {string}                  fields     Field list
 * @return {Promise<IConnectionModel>}            Promise with Connection Info
 */
export function queryConnectionById(databaseId: Schema.Types.ObjectId, fields: string = null): Promise<IConnectionModel> {
    return Connection.findById(databaseId, fields).exec();
}

/**
 * Query database list
 * @param  {IUserSearchModel}                    query    Query condition
 * @param  {number}                              page     Page
 * @param  {number}                              pageSize Page size
 * @param  {string}                              fields   Field list
 * @return {Promise<[number, IConnectionModel[]]>}          Promise with total number & database info list
 */
export function queryConnectionList(query: IConnectionSearchModel, page: number, pageSize: number, fields: string): Promise<[number, IConnectionModel[]]> {
    const condition: any = {};
    if (query.name && query.name.length >= strLength[0] && query.name.length <= strLength[0]) {
        condition.name = {
            $regex: query.name
        };
    }
    if (query.type && ConnectionType[query.type]) {
        condition.type = query.type;
    }
    return Promise.all([
        Connection.count(condition).exec(),
        Connection.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Createa database info
 * @param  {IConnectionModel}          databaseData Connection data
 * @return {Promise<IConnectionModel>}              Promise with database Info
 */
export function createConnection(databaseData: IConnectionModel): Promise<IConnectionModel> {
    const database = Object.assign(new Connection(), databaseData);
    return database.save();
}

/**
 * Modify database info
 * @param  {Schema.Types.ObjectId}   databaseId   Connection ID
 * @param  {IConnectionModel}          databaseData Connection data
 * @return {Promise<IConnectionModel>}              Promise with database Info
 */
export function modifyConnectionById(databaseId: Schema.Types.ObjectId, databaseData: IConnectionModel): Promise<IConnectionModel> {
    return Connection.findByIdAndUpdate(databaseId, databaseData).exec();
}
