import * as fastify from 'fastify';

import {IAppRequest} from '../../interfaces/common';
import {modifyDetailSchema, queryDetailSchema} from '../../schema/common';
import * as taskSchema from '../../schema/task';
import {TaskStatus} from '../../types/task';

import {createTask, deleteTaskById, modifyTaskById, queryTaskByIdWithUsers, queryTaskList} from '../../services/task';

import {buildPageInfo, getHttpMsg, getListQueryData} from '../../modules/util';

module.exports = (app: fastify.FastifyInstance, _opts: any, next: any) => {
    // Create task
    app.post('/', {
        schema: {
            body: taskSchema.createSchema
        }
    }, (request: IAppRequest, reply) => {
        return createTask(request.body, request.session.user.id)
            .then((task) => {
                reply.send(getHttpMsg(request, task._id));
            });
    });
    // Modify task
    app.patch('/', {
        schema: {
            body: taskSchema.modifySchema
        }
    }, (request: IAppRequest, reply) => {
        return modifyTaskById(request.body.modifyId, request.session.user.id, request.body)
            .then(() => {
                reply.send(getHttpMsg(request, null));
            });
    });
    // Delete task profile
    app.delete('/', {
        schema: {
            body: modifyDetailSchema
        }
    }, (request: IAppRequest, reply) => {
        return deleteTaskById(request.body.id, request.session.user.id)
            .then(() => {
                reply.send(getHttpMsg(request, null));
            });
    });
    // Search task
    app.get('/', {
        schema: {
            querystring: taskSchema.searchSchema
        }
    }, (request: IAppRequest, reply) => {
        buildPageInfo(request);
        request.query.userId = request.session.user.id;
        request.query.status = TaskStatus.ENABLE;
        return queryTaskList(getListQueryData(request.query), request.query.page, request.query.pageSize)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    // Get task profile
    app.get('/profile/', {
        schema: {
            querystring: queryDetailSchema
        }
    }, (request: IAppRequest, reply) => {
        return queryTaskByIdWithUsers(request.query.id, request.session.user.id)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    next();
};
