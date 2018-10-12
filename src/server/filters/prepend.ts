import {app, escapeData, filterSensitiveFields, isObjEmpty} from '../modules/util';

// Set error handle
app.addHook('preHandler', (request, _reply, next) => {
    if (!isObjEmpty(request.body)) {
        escapeData(request.body);
        request.log.info('request body data:', filterSensitiveFields(request.body));
    }
    return next();
});
