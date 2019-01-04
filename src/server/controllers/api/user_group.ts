import * as fastify from 'fastify';

import {IAppRequest} from '../../interfaces/common';
import {queryDetailSchema} from '../../schema/common';
import * as userGroupSchema from '../../schema/user_group';

import {createUserGroup, modifyUserGroupById, queryUserGroupByIdWithUsers, queryUserGroupList} from '../../services/user_group';

import {buildPageInfo, getHttpMsg, getListQueryData} from '../../modules/util';

module.exports = (app: fastify.FastifyInstance, _opts: any, next: any) => {
    // Create user group
    app.post('/', {
        schema: {
            body: userGroupSchema.createSchema
        }
    }, (request: IAppRequest, reply) => {
        return createUserGroup(request.body)
            .then((userGroup) => {
                reply.send(getHttpMsg(request, userGroup._id));
            });
    });
    // Modify user group
    app.patch('/', {
        schema: {
            body: userGroupSchema.modifySchema
        }
    }, (request: IAppRequest, reply) => {
        return modifyUserGroupById(request.body.modifyId, request.body)
            .then(() => {
                reply.send(getHttpMsg(request, null));
            });
    });
    // Search user group
    app.get('/', {
        schema: {
            querystring: userGroupSchema.searchSchema
        }
    }, (request: IAppRequest, reply) => {
        buildPageInfo(request);
        request.query.userId = request.session.user.id;
        return queryUserGroupList(getListQueryData(request.query), request.query.page, request.query.pageSize)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    // Get user group profile
    app.get('/profile/', {
        schema: {
            querystring: queryDetailSchema
        }
    }, (request: IAppRequest, reply) => {
        return queryUserGroupByIdWithUsers(request.query.id)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    next();
};
