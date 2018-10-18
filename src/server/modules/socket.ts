import * as cookie from 'cookie';
import * as WebSocket from 'ws';

import {ISocketClient} from '../interfaces/common';

import cacheclient from './cache';
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
        return cacheclient.get(id)
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

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            app.log.debug('received:', message);
            // todo, create room
        });
    });
}

/**
 * Send socket message
 * @param {string} message Message
 * @param {string} userId  User ID
 */
export function send(message: any, userId: string): void {
    // If not local close
    if (config.socket !== 'local') {
        return;
    }
    // Send message for every task
    const sendData = JSON.stringify(message);
    wss.clients.forEach(function each(client: ISocketClient) {
        if (client.userId === userId && client.readyState === WebSocket.OPEN) {
            client.send(sendData);
        }
    });
}
