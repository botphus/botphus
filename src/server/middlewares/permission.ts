import * as fp from 'fastify-plugin';
import * as url from 'url';

import {IAppReply, IAppRequest} from '../interfaces/common';
import {SystemCode} from '../types/common';
import {userPermissionMap} from '../types/user';

import {checkUserPermission, createSystemError, localePkg} from '../modules/util';

function valid(request: IAppRequest, _reply: IAppReply, next: (err?: Error) => void): void {
    const urlInfo = url.parse(request.req.url);
    request.log.debug('Check permission start:', urlInfo.pathname);
    if (urlInfo.pathname.indexOf('/api') >= 0) {
        const permissionIndex: string = `${request.req.method.toLowerCase()}:${urlInfo.pathname.replace('/api', '')}`;
        const permissionCode: number = userPermissionMap[permissionIndex];
        // Check login status
        if (permissionCode >= 0) {
            const err = request.session.user ?
                null : createSystemError(localePkg.SystemCode.loginForbidden, SystemCode.FORBIDDEN);
            return next(err);
        }
        // Check permission config
        if (permissionCode) {
            request.log.debug('Check permission code:', permissionCode);
            // Bit operation for permission check
            const err = request.session.user && checkUserPermission(request.session.user.permission, permissionCode) ?
                null : createSystemError(localePkg.SystemCode.permissionForbidden, SystemCode.FORBIDDEN);
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
    fastify.addHook('preHandler', valid);
    next();
});
