import * as fastify from 'fastify';

import {IAppRequest} from '../../interfaces/common';
import {queryDetailSchema} from '../../schema/common';
import * as unionTaskFollowSchema from '../../schema/union_task_flow';

import {createUnionTaskFlow, queryUnionTaskFlowByUser, queryUnionTaskFlowList, startUnionTaskFlow} from '../../services/union_task_flow';

import {buildPageInfo, getHttpMsg, getListQueryData, localePkg} from '../../modules/util';

module.exports = (app: fastify.FastifyInstance, _opts: any, next: any) => {
    // Create task flow
    app.post('/', {
        schema: {
            body: unionTaskFollowSchema.createSchema
        }
    }, (request: IAppRequest, reply) => {
        return createUnionTaskFlow(request.body, request.session.user.id)
            .then((task) => {
                reply.send(getHttpMsg(request, task._id));
            });
    });
    // Search task flow
    app.get('/', {
        schema: {
            querystring: unionTaskFollowSchema.searchSchema
        }
    }, (request: IAppRequest, reply) => {
        buildPageInfo(request);
        request.query.createdUser = request.session.user.id;
        return queryUnionTaskFlowList(getListQueryData(request.query), request.query.page, request.query.pageSize)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    // Get task profile flow
    app.get('/profile/', {
        schema: {
            querystring: queryDetailSchema
        }
    }, (request: IAppRequest, reply) => {
        return queryUnionTaskFlowByUser(request.query.id)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    app.get('/start/', {
        schema: {
            querystring: queryDetailSchema
        }
    }, (request: IAppRequest, reply) => {
        return startUnionTaskFlow(request.query.id, request.session.user.id)
            .then((data) => {
                reply.send(getHttpMsg(request, data, localePkg.Service.TaskFlow.taskStartSuccess));
            });
    });
    next();
};
