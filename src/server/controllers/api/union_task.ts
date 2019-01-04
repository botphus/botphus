import * as fastify from 'fastify';

import {IAppRequest} from '../../interfaces/common';
import {modifyDetailSchema, queryDetailSchema} from '../../schema/common';
import * as unionTaskSchema from '../../schema/union_task';
import {TaskStatus} from '../../types/task';

import {createUnionTask, deleteUnionTaskById, modifyUnionTaskById, queryUnionTaskByIdWithUsers, queryUnionTaskList} from '../../services/union_task';
import {queryUserGroupByUserId} from '../../services/user_group';

import {buildPageInfo, getHttpMsg, getListQueryData} from '../../modules/util';

module.exports = (app: fastify.FastifyInstance, _opts: any, next: any) => {
    // Create union task
    app.post('/', {
        schema: {
            body: unionTaskSchema.createSchema
        }
    }, (request: IAppRequest, reply) => {
        return createUnionTask(request.body, request.session.user.id)
            .then((unionTask) => {
                reply.send(getHttpMsg(request, unionTask._id));
            });
    });
    // Modify union task
    app.patch('/', {
        schema: {
            body: unionTaskSchema.modifySchema
        }
    }, (request: IAppRequest, reply) => {
        return modifyUnionTaskById(request.body.modifyId, request.session.user.id, request.body)
            .then(() => {
                reply.send(getHttpMsg(request, null));
            });
    });
    // Delete union task profile
    app.delete('/', {
        schema: {
            body: modifyDetailSchema
        }
    }, (request: IAppRequest, reply) => {
        return deleteUnionTaskById(request.body.id, request.session.user.id)
            .then(() => {
                reply.send(getHttpMsg(request, null));
            });
    });
    // Search union task
    app.get('/', {
        schema: {
            querystring: unionTaskSchema.searchSchema
        }
    }, (request: IAppRequest, reply) => {
        buildPageInfo(request);
        request.query.userId = request.session.user.id;
        request.query.status = TaskStatus.ENABLE;
        return queryUserGroupByUserId(request.session.user.id, '_id')
            .then((groupList) => {
                if (groupList && groupList.length > 0) {
                    request.query.userGroups = groupList.map((item) => {
                        return item.id;
                    });
                }
                return queryUnionTaskList(getListQueryData(request.query), request.query.page, request.query.pageSize)
                    .then((data) => {
                        reply.send(getHttpMsg(request, data));
                    });
            });
    });
    // Get union task profile
    app.get('/profile/', {
        schema: {
            querystring: queryDetailSchema
        }
    }, (request: IAppRequest, reply) => {
        return queryUnionTaskByIdWithUsers(request.query.id, request.session.user.id)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    next();
};
