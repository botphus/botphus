import * as fastify from 'fastify';

import {queryDetailSchema} from '../../schema/common';
import * as connectionSchema from '../../schema/connection';

import {createConnection, modifyConnectionById, queryConnectionById, queryConnectionList} from '../../services/connection';

import {buildPageInfo, getHttpMsg, getListQueryData} from '../../modules/util';

module.exports = (app: fastify.FastifyInstance, _opts: any, next: any) => {
    // Create connection
    app.post('/', {
        schema: {
            body: connectionSchema.createSchema
        }
    }, (request, reply) => {
        return createConnection(request.body)
            .then((connection) => {
                reply.send(getHttpMsg(request, connection._id));
            });
    });
    // Modify connection
    app.patch('/', {
        schema: {
            body: connectionSchema.modifySchema
        }
    }, (request, reply) => {
        return modifyConnectionById(request.body.modifyId, request.body)
            .then(() => {
                reply.send(getHttpMsg(request, null));
            });
    });
    // Search connection
    app.get('/', {
        schema: {
            querystring: connectionSchema.searchSchema
        }
    }, (request, reply) => {
        buildPageInfo(request);
        return queryConnectionList(getListQueryData(request.query), request.query.page, request.query.pageSize)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    // Get connection profile
    app.get('/profile/', {
        schema: {
            querystring: queryDetailSchema
        }
    }, (request, reply) => {
        return queryConnectionById(request.query.id)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    next();
};
