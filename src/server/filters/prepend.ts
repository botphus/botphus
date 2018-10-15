import * as cookie from 'fastify-cookie';
import * as helmet from 'fastify-helmet';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as serveStatic from 'serve-static';

import session from '../middlewares/session';

import {app, escapeData, filterSensitiveFields, isObjEmpty} from '../modules/util';

// Middlewares
app.use(favicon(path.join(process.cwd(), 'favicon.ico')));
app.register(helmet);
app.use('/public/', serveStatic(path.join(process.cwd(), '/dist/client/')));
app.register(cookie);
app.register(session);

// Set log handle
app.addHook('preHandler', (request, _reply, next) => {
    // Escape Data
    if (!isObjEmpty(request.body)) {
        escapeData(request.body);
        request.log.info('request body data:', filterSensitiveFields(request.body));
    }
    if (isObjEmpty(request.query)) {
        escapeData(request.query);
    }
    if (isObjEmpty(request.params)) {
        escapeData(request.params);
    }
    return next();
});
