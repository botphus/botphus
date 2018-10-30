import {message} from 'antd';
import ReconnectingWebSocket from 'reconnecting-websocket';

import {SocketMessageType} from '../types/common';

import store from '../store';
import {socketServer} from './const';
import {log} from './util';

let rws: ReconnectingWebSocket;

function onOpen() {
    log.info('Socket Connect Success');
    sendSocketMessage(SocketMessageType.ENTER, store.getState().user.owner.id || '');
}

function onMessage(event) {
    try { // 获取解析错误
        log.debug(event);
    } catch (e) {
        log.error(e);
    }
}

function onError(err) {
    message.warn('Socket Close, please refresh to reload!');
    log.error(err);
}

/**
 * Send socket message
 * @param {SocketMessageType} type    Send socket message type
 * @param {string}            sendMsg Message string
 */
export function sendSocketMessage(type: SocketMessageType, sendMsg: string): void {
    if (rws) {
        rws.send(`${type}:${sendMsg}`);
    }
}

/**
 * Connect socket
 */
export function connectSocket() {
    log.info('Connect Socket By Client');
    rws = new ReconnectingWebSocket(socketServer, [], {
        connectionTimeout: 1000,
        maxRetries: 10
    });
    rws.addEventListener('open', onOpen);
    rws.addEventListener('message', onMessage);
    rws.addEventListener('error', onError);
}

/**
 * Disconnect socket
 */
export function disconnectSocket() {
    if (rws) {
        rws.close();
        rws.removeEventListener('open', onOpen);
        rws.removeEventListener('message', onMessage);
        rws.removeEventListener('error', onError);
    }
    log.info('Disconnect Socket By Client');
}
