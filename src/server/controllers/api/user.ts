import * as fastify from 'fastify';

import {IAppRequest} from '../../interfaces/common';
import * as userSchema from '../../schema/user';
import {SystemCode} from '../../types/common';

import {checkInstallStatus} from '../../services/install';
import {createUser, modifyUserById, verifyUserLogin} from '../../services/user';

import {createSystemError, getHttpMsg, localePkg} from '../../modules/util';

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
            .then(() => {
                reply.send(getHttpMsg(request, null));
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
                request.session.user = {
                    email: user.email,
                    id: user._id,
                    nickname: user.nickname,
                    permission: user.permission
                };
                reply.send(getHttpMsg(request, null));
            });
    });
    // User logout
    app.get('/logout/', {
        schema: {
            querystring: {}
        }
    }, (request: IAppRequest, reply) => {
        if (request.session.user) {
            return clear(request, reply, () => {
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
        return modifyUserById(request.body.userId || request.session.user.id, request.session.user.id, request.session.user.permission, request.body)
            .then(() => {
                reply.send(getHttpMsg(request, null));
            });
    });
    next();
};
