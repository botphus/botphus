import {Schema} from 'mongoose';

import {Connection} from '../models/';

import {IConnectionModel, IConnectionSearchModel} from '../interfaces/model';

import {ConnectionType} from '../types/connection';
import {strLength} from '../types/rules';

/**
 * Query connection info config by ID
 * @param  {Schema.Types.ObjectId}   connectionId Connection ID
 * @param  {string}                  fields     Field list
 * @return {Promise<IConnectionModel>}            Promise with Connection Info
 */
export function queryConnectionById(connectionId: Schema.Types.ObjectId, fields: string = null): Promise<IConnectionModel> {
    return Connection.findById(connectionId, fields).exec();
}

/**
 * Query connection list
 * @param  {IUserSearchModel}                    query    Query condition
 * @param  {number}                              page     Page
 * @param  {number}                              pageSize Page size
 * @param  {string}                              fields   Field list
 * @return {Promise<[number, IConnectionModel[]]>}          Promise with total number & connection info list
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
 * Createa connection info
 * @param  {IConnectionModel}          connectionData Connection data
 * @return {Promise<IConnectionModel>}              Promise with connection Info
 */
export function createConnection(connectionData: IConnectionModel): Promise<IConnectionModel> {
    const connection = Object.assign(new Connection(), connectionData);
    return connection.save();
}

/**
 * Modify connection info
 * @param  {Schema.Types.ObjectId}   connectionId   Connection ID
 * @param  {IConnectionModel}          connectionData Connection data
 * @return {Promise<IConnectionModel>}              Promise with connection Info
 */
export function modifyConnectionById(connectionId: Schema.Types.ObjectId, connectionData: IConnectionModel): Promise<IConnectionModel> {
    return Connection.updateOne({
        _id: connectionId
    }, connectionData).exec();
}
