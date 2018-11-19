import * as fastify from 'fastify';

import {IAppReply, IAppRequest} from '../interfaces/common';
import {HookType} from '../types/hook';

import config from '../modules/config';
import {getHook, hasHook} from '../modules/hook';
import getTemplate from '../modules/template';

import {checkInstallStatus} from '../services/install';

function renderData(request: IAppRequest, reply: IAppReply) {
    reply.header('Content-Type', 'text/html; charset=utf-8');
    return getTemplate().then((template) => {
        reply.send(template({
            authLogin: hasHook(HookType.AUTH_LOGIN),
            salt: config.clientSalt,
            socketServer: config.socket === 'local' ? config.socketPort : config.socket,
            title: config.title,
            user: JSON.stringify(request.session && request.session.user ? request.session.user : {})
        }));
    });
}

module.exports = (app: fastify.FastifyInstance, _opts: any, next: any) => {
    // Client
    app.get('/', (_request, reply) => {
        return checkInstallStatus()
        .then((closeInstall) => {
            if (closeInstall) {
                return reply.redirect(301, '/login/');
            }
            reply.redirect(302, '/install/');
        });
    });
    app.get('/dashboard/*', (request: IAppRequest, reply: IAppReply) => {
        if (!(request.session && request.session.user && request.session.user.id)) {
            reply.redirect(302, '/login/');
            return;
        }
        return renderData(request, reply);
    });
    app.get('/login/', (request: IAppRequest, reply: IAppReply) => {
        if (request.session && request.session.user && request.session.user.id) {
            reply.redirect(302, '/dashboard/');
            return;
        }
        return renderData(request, reply);
    });
    app.get('/install/', renderData);
    // Check hook & add hook function
    if (hasHook(HookType.AUTH_LOGIN)) {
        app.get('/auth-login/', getHook(HookType.AUTH_LOGIN));
    }
    next();
};
