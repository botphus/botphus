import * as cookie from 'fastify-cookie';
import * as helmet from 'fastify-helmet';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as serveStatic from 'serve-static';
import * as url from 'url';

import {IAppRequest} from '../interfaces/common';
import {closeBodyEscapeMap} from '../types/common';

import permissionMid from '../middlewares/permission';
import sessionMid from '../middlewares/session';

import {app, escapeData, filterSensitiveFields, isObjEmpty} from '../modules/util';

// Middlewares
app.use(favicon(path.join(process.cwd(), 'favicon.ico')));
app.register(helmet);
app.use('/public/', serveStatic(path.join(process.cwd(), '/dist/client/')));
// Cookie parse & set
app.register(cookie);
// Session init
app.register(sessionMid);
// Permission valid
app.register(permissionMid);

// Set log handle
app.addHook('preHandler', (request: IAppRequest, _reply, next) => {
    // Escape Data
    if (!isObjEmpty(request.body)) {
        const urlInfo = url.parse(request.req.url);
        const closeEscape: string = `${request.req.method.toLowerCase()}:${urlInfo.pathname}`;
        if (!closeBodyEscapeMap[closeEscape]) {
            escapeData(request.body);
        }
        request.log.info('request body data:', filterSensitiveFields(request.body));
    }
    if (isObjEmpty(request.query)) {
        escapeData(request.query);
    }
    if (isObjEmpty(request.params)) {
        escapeData(request.params);
    }
    // Print user info
    if (request.session.user) {
        request.log.info(`Request user: ${request.session.user.nickname}`);
    } else {
        request.log.info('Request user: Guest');
    }
    return next();
});
