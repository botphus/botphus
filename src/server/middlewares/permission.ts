import * as fp from 'fastify-plugin';
import * as url from 'url';

import {IAppReply, IAppRequest} from '../interfaces/common';
import {SystemCode} from '../types/common';
import {userPermissionMap} from '../types/user';

import {createSystemError, localePkg} from '../modules/util';

function valid(request: IAppRequest, _reply: IAppReply, next: (err?: Error) => void): void {
    const urlInfo = url.parse(request.originalUrl);
    request.log.debug('Check permission start:', urlInfo.pathname);
    if (urlInfo.pathname.indexOf('/api')) {
        const permissionIndex: string = `${request.method.toLowerCase()}:${urlInfo.pathname.replace('/api', '')}`;
        const permissionCode: number = userPermissionMap[permissionIndex];
        // Check permission config
        if (permissionCode) {
            request.log.debug('Check permission code:', permissionCode);
            // Bit operation for permission check
            const err = request.session.user && (request.session.user.permission & permissionCode) > 0 ?
                null : createSystemError(localePkg.Service.User.permissionForbidden, SystemCode.FORBIDDEN);
            return next(err);
        }
        request.log.debug('Check permission end: can\'t find permission code setting');
        return next();
    }
    request.log.debug('Check permission end: validation path should be startwith "/api"');
    next();
}

export default fp((fastify, _opts, next) => {
    // Init session
    fastify.addHook('onRequest', valid);
    next();
});
