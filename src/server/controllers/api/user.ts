import * as fastify from 'fastify';

import {IAppRequest} from '../../interfaces/common';
import {queryDetailSchema} from '../../schema/common';
import * as userSchema from '../../schema/user';
import {SystemCode} from '../../types/common';

import {checkInstallStatus} from '../../services/install';
import {createUser, getUserSession, modifyUserById, queryUserById, queryUserList, verifyUserLogin} from '../../services/user';

import {buildPageInfo, createSystemError, getHttpMsg, getListQueryData, localePkg} from '../../modules/util';

import {clear} from '../../middlewares/session';

module.exports = (app: fastify.FastifyInstance, _opts: any, next: any) => {
    // Create admin user when install
    app.post('/install/', {
        schema: {
            body: userSchema.createSchema
        }
    }, (request, reply) => {
        return checkInstallStatus()
            .then((closeInstall) => {
                if (closeInstall) {
                    throw createSystemError(localePkg.Service.Install.installClose, SystemCode.ROUTINE_ERROR);
                }
                // Save user data
                const saveData: any = Object.assign({
                    permission: 0b1111111111
                }, request.body);
                return createUser(saveData);
            })
            .then((user) => {
                reply.send(getHttpMsg(request, user._id));
            });
    });
    // User login
    app.post('/login/', {
        schema: {
            body: userSchema.loginSchema
        }
    }, (request: IAppRequest, reply) => {
        return verifyUserLogin(request.body.email, request.body.password)
            .then((user) => {
                request.session.user = getUserSession(user);
                reply.send(getHttpMsg(request, request.session.user));
            });
    });
    // User logout
    app.get('/logout/', {
        schema: {
            querystring: {}
        }
    }, (request: IAppRequest, reply) => {
        if (request.session.user) {
            return clear(request, reply)
                .then(() => {
                    reply.send(getHttpMsg(request, null));
                });
        }
        reply.send(getHttpMsg(request, null));
    });
    // Create user account
    app.post('/', {
        schema: {
            body: userSchema.createSchema
        }
    }, (request, reply) => {
        return createUser(request.body)
            .then((user) => {
                reply.send(getHttpMsg(request, user._id));
            });
    });
    // Modify user account
    app.patch('/', {
        schema: {
            body: userSchema.modifySchema
        }
    }, (request: IAppRequest, reply) => {
        return modifyUserById(request.body.modifyId || request.session.user.id, request.session.user.id, request.session.user.permission, request.body)
            .then(() => {
                // Update session info when self update
                if (!request.body.modifyId || (request.body.modifyId === request.session.user.id)) {
                    // If password change, need relogin
                    if (request.body.password) {
                        return clear(request, reply);
                    }
                    if (request.body.email) {
                        request.session.user.email = request.body.email;
                    }
                    if (request.body.nickname) {
                        request.session.user.nickname = request.body.nickname;
                    }
                    if (request.body.permission) {
                        request.session.user.permission = request.body.permission;
                    }
                }
                return null;
            })
            .then(() => {
                reply.send(getHttpMsg(request, null));
            });
    });
    // Search uesr
    app.get('/', {
        schema: {
            querystring: userSchema.searchSchema
        }
    }, (request, reply) => {
        buildPageInfo(request);
        return queryUserList(getListQueryData(request.query), request.query.page, request.query.pageSize)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    // Get self profile
    app.get('/profile/my/', (request: IAppRequest, reply) => {
        reply.send(getHttpMsg(request, request.session.user));
    });
    // Get user profile
    app.get('/profile/', {
        schema: {
            querystring: queryDetailSchema
        }
    }, (request, reply) => {
        return queryUserById(request.query.id)
            .then((data) => {
                reply.send(getHttpMsg(request, data));
            });
    });
    next();
};
