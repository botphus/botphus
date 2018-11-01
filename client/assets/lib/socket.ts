import {message} from 'antd';
import ReconnectingWebSocket from 'reconnecting-websocket';

import {ITaskReportDetailItem} from '../interfaces/task';
import {SocketMessageType, TaskFlowStatus} from '../types/common';

import store from '../store';
import {socketServer} from './const';
import {log} from './util';

import {updateTaskFlowReportMap, updateTaskFlowStatus} from '../actions/task_flow';

let rws: ReconnectingWebSocket;

function onOpen() {
    log.info('Socket Connect Success');
    sendSocketMessage(SocketMessageType.ENTER, store.getState().user.owner.id || '');
}

function onMessage(event) {
    try {// Get message
        // Get socket message
        const result = event.data.match(/^([^:]+):([\S\s]+)$/);
        if (!result) {
            return;
        }
        const messageType = result[1];
        const messageCon = result[2];
        const taskFlowState = store.getState().taskFlow;
        switch (messageType) {
            case SocketMessageType.UPDATE:
                if (taskFlowState.detail._id) {
                    const updateMessageList = messageCon.match(/^([^\|]+)\|([^\|]+)\|([\S\s]+)$/);
                    if (!updateMessageList) {
                        return;
                    }
                    const updateTaskId = updateMessageList[1];
                    const updateIndex = updateMessageList[2];
                    const updateMessageData = JSON.parse(updateMessageList[3]);
                    if (!taskFlowState.detail._id || updateTaskId !== taskFlowState.detail._id) {
                        return;
                    }
                    const reportData: ITaskReportDetailItem = {
                        index: updateIndex,
                        ...updateMessageData
                    };
                    store.dispatch(updateTaskFlowReportMap(reportData));
                }
                break;
            case SocketMessageType.END:
                const endMessageList = messageCon.match(/^([^\|]+)\|([^\|]+)$/);
                if (!endMessageList) {
                    return;
                }
                const endTaskId = endMessageList[1];
                const endTaskMessage = endMessageList[2];
                if (!taskFlowState.detail._id || endTaskId !== taskFlowState.detail._id) {
                    return;
                }
                store.dispatch(updateTaskFlowStatus(endTaskMessage === 'success' ? TaskFlowStatus.SUCCESS : TaskFlowStatus.FAILED));
                break;
        }
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
