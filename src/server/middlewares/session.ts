import * as fp from 'fastify-plugin';
import * as uid from 'uid';

import {IAppReply, IAppRequest} from '../interfaces/common';

import cache, {getRedisKey} from '../modules/cache';
import config from '../modules/config';
import {createMD5Sign} from '../modules/util';

const sessionSecret: string = uid(10);
const sessionCookieKey: string = config.sessionCookieKey;
const sessionRedisExpire: number = config.sessionRedisExpire * 60 * 60 * 1000;

/**
 * Generate session data
 * @param  {string} id Session ID
 * @return {any}       Session data
 */
function generate(id?: string): any {
    const session: any = {};
    if (id) {
        session.id = id;
    } else {
        session.id = `${new Date().getTime()}${uid(18)}`;
        session.id = createMD5Sign(session.id, sessionSecret);
    }
    return session;
}

/**
 * Init session
 */
export function init(request: IAppRequest, _reply: IAppReply, next: (err?: Error) => void): void {
    const id = request.cookies[sessionCookieKey];
    if (!id) {
        request.session = generate();
        next();
    } else {
        cache.get(getRedisKey(id))
            .then((data) => {
                if (data) {
                    const session = JSON.parse(data);
                    request.session = request.initSession = session;
                } else {
                    request.session = generate(id);
                }
                next();
            })
            .catch((err) => {
                request.log.warn('Get cookie data to redis error');
                request.log.warn(err);
                request.session = generate();
                next();
            });
    }
}

/**
 * Save(create/update) session
 */
export function save(request: IAppRequest, reply: IAppReply, _payload: any, next: (err?: Error, value?: any) => void): void {
    if (!request.session) {
        return next();
    }
    const id = request.session.id;
    const sessionKeys = Object.keys(request.session);
    if (id && sessionKeys.length === 1 // No data need save
        ||
        // Not below:
        // 1. Create session: If doesn't have init session
        // 2. Update session: If data need update
        !(!request.initSession || JSON.stringify(request.session) === JSON.stringify(request.initSession))) {
        return next();
    }
    const data = JSON.stringify(request.session);
    cache.set(getRedisKey(id), data, 'EX', sessionRedisExpire)
        .then(() => {
            reply.setCookie(sessionCookieKey, id, {
                path: '/'
            });
            next();
        })
        .catch((err) => {
            request.log.warn('Save cookie data to redis error');
            request.log.warn(err);
            next();
        });
}

/**
 * Clear session
 */
export function clear(request: IAppRequest, reply: IAppReply): Promise<void> {
    const id = request.cookies[sessionCookieKey];
    request.session = null;
    return cache.del(getRedisKey(id))
        .then(() => {
            reply.setCookie(sessionCookieKey, '', {
                expires: new Date(),
                maxAge: 0,
                path: '/'
            });
        })
        .catch((err) => {
            request.log.warn('Delete cookie data to redis error');
            request.log.warn(err);
        });
}

export default fp((fastify, _opts, next) => {
    // Init session
    fastify.addHook('preHandler', init);
    // Save session data
    fastify.addHook('onSend', save);
    next();
});
