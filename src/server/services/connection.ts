import {Schema} from 'mongoose';

import {Connection} from '../models/';

import {IConnectionBaseModel, IConnectionModel, IConnectionSearchModel} from '../interfaces/model';
import {ConnectionType} from '../types/connection';

import {createSystemError, localePkg} from '../modules/util';

/**
 * Default user find fields
 * @type {String}
 */
const defaultFields: string = '_id name type';

/**
 * Valid connection config
 * @param  {IConnectionModel} connectionData Connection data
 * @return {Promise<void>}                   Pass or not
 */
function validConnectionConfig(connectionData: IConnectionModel): Promise<void> {
    let valid: boolean = false;
    switch (connectionData.type) {
        case ConnectionType.MYSQL:
            valid = !!(connectionData.config.database && connectionData.config.host && connectionData.config.user);
            break;
        case ConnectionType.REDIS:
            if (Array.isArray(connectionData.config)) {
                valid = connectionData.config.every((item) => {
                    return !!(item.host && item.port);
                });
            } else {
                // @ts-ignore: next
                valid = typeof connectionData.config === 'object' && !!(connectionData.config.host && connectionData.config.port);
            }
    }
    if (valid) {
        return Promise.resolve();
    } else {
        return Promise.reject(createSystemError(localePkg.Service.Connection.configValidError));
    }
}

/**
 * Query connection info config by ID
 * @param  {Schema.Types.ObjectId}     connectionId Connection ID
 * @param  {string}                    fields     Field list
 * @return {Promise<IConnectionBaseModel>}            Promise with Connection Info
 */
export function queryConnectionById(connectionId: Schema.Types.ObjectId, fields: string = null): Promise<IConnectionBaseModel> {
    return Connection.findById(connectionId, fields).exec();
}

/**
 * Query connection list
 * @param  {IUserSearchModel}                      query    Query condition
 * @param  {number}                                page     Page
 * @param  {number}                                pageSize Page size
 * @param  {string}                                fields   Field list
 * @return {Promise<[number, IConnectionBaseModel[]]>}          Promise with total number & connection info list
 */
export function queryConnectionList(query: IConnectionSearchModel, page: number, pageSize: number, fields: string = defaultFields): Promise<[number, IConnectionBaseModel[]]> {
    const condition: any = {};
    if (query.name) {
        condition.name = {
            $regex: query.name
        };
    }
    if (query.type && ConnectionType[query.type]) {
        condition.type = query.type;
    }
    return Promise.all([
        Connection.countDocuments(condition).exec(),
        Connection.find(condition).select(fields).skip((page - 1) * pageSize).limit(pageSize).sort({
            _id: -1
        }).exec()
    ]);
}

/**
 * Createa connection info
 * @param  {IConnectionBaseModel}          connectionData Connection data
 * @return {Promise<IConnectionBaseModel>}                Promise with connection Info
 */
export function createConnection(connectionData: IConnectionBaseModel): Promise<IConnectionBaseModel> {
    // @ts-ignore:next
    return validConnectionConfig(connectionData)
        .then(() => {
            const connection = Object.assign(new Connection(), connectionData);
            return connection.save();
        });
}

/**
 * Modify connection info
 * @param  {Schema.Types.ObjectId}   connectionId   Connection ID
 * @param  {IConnectionBaseModel}          connectionData Connection data
 * @return {Promise<IConnectionBaseModel>}              Promise with connection Info
 */
export function modifyConnectionById(connectionId: Schema.Types.ObjectId, connectionData: IConnectionBaseModel): Promise<any> {
    // @ts-ignore:next
    return validConnectionConfig(connectionData)
        .then(() => {
            return Connection.updateOne({
                _id: connectionId
            }, connectionData).exec();
        });
}
