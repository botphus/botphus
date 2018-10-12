import {app, escapeData, filterSensitiveFields, isObjEmpty} from '../modules/util';

// Set error handle
app.addHook('preHandler', (request, _reply, next) => {
    if (!isObjEmpty(request.query)) {
        escapeData(request.query);
        request.log.info('request query data:', filterSensitiveFields(request.query));
    }
    if (!isObjEmpty(request.params)) {
        escapeData(request.params);
        request.log.info('request params data:', filterSensitiveFields(request.params));
    }
    if (!isObjEmpty(request.body)) {
        escapeData(request.body);
        request.log.info('request body data:', filterSensitiveFields(request.body));
    }
    return next();
});
