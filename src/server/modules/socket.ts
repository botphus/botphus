import * as cookie from 'cookie';
import * as WebSocket from 'ws';

import {ISocketClient} from '../interfaces/common';
import {SocketMessageType} from '../types/socket';

import cacheclient, {getRedisKey} from './cache';
import config from './config';
import {app} from './util';

const wss = config.socket === 'local' ? new WebSocket.Server({
    port: config.socketPort,
    verifyClient(info, cb) {
        if (typeof info.req.headers.cookie !== 'string') {
            return cb(false);
        }
        const cookieInfo = cookie.parse(info.req.headers.cookie);
        const id = cookieInfo[config.sessionCookieKey];
        return cacheclient.get(getRedisKey(id))
            .then((data) => {
                if (data) {
                    return cb(true);
                }
                cb(false);
            });
    }
}) : null;

const socketLogIndex = 'Socket: ';

// Set socket linstener
if (config.socket === 'local') {
    app.log.info(`${socketLogIndex}Listenning on port ${config.socketPort}`);

    wss.on('connection', function connection(ws: ISocketClient) {
        ws.on('message', function incoming(message: string) {
            app.log.debug(`${socketLogIndex}receive ${message}`);
            const [messageType, messageString] = message.split(':');
            if (!messageString) {
                return;
            }
            switch (messageType) {
                case SocketMessageType.ENTER:
                    ws.userId = messageString;
                    break;
            }
        });
    });
}

/**
 * Send socket message
 * @param {string} message Message
 * @param {string} userId  User ID
 */
export function send(message: string, userId: string): void {
    // If not local close
    if (config.socket !== 'local') {
        return;
    }
    // Send message for every task
    wss.clients.forEach(function each(client: ISocketClient) {
        if (client.userId === userId && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

/**
 * Close socket server
 */
export function close() {
    // If not local close
    if (config.socket !== 'local') {
        return;
    }
    wss.close();
}
