import * as fastify from 'fastify';

import {IAppReply, IAppRequest} from '../interfaces/common';

import config from '../modules/config';
import getTemplate from '../modules/template';

import {checkInstallStatus} from '../services/install';

function renderData(_request: IAppRequest, reply: IAppReply) {
    reply.header('Content-Type', 'text/html; charset=utf-8');
    return getTemplate().then((template) => {
        reply.send(template({
            salt: config.clientSalt,
            socketServer: config.socket === 'local' ? config.socketPort : config.socket,
            title: config.title,
        }));
    });
}

module.exports = (app: fastify.FastifyInstance, _opts: any, next: any) => {
    // Client
    app.get('/', (_request, reply) => {
        return checkInstallStatus()
        .then((closeInstall) => {
            if (closeInstall) {
                return reply.redirect(301, 'client');
            }
            reply.redirect(302, '/install/');
        });
    });
    app.get('/client/*', renderData);
    app.get('/install/', renderData);
    next();
};
