import {message} from 'antd';
import ReconnectingWebSocket from 'reconnecting-websocket';

import {ITaskReportDetailItem} from '../interfaces/task';
import {SocketMessageType, TaskReportType} from '../types/common';

import store from '../store';
import {socketServer} from './const';
import {log} from './util';

import {updateTaskFlowReportMap, updateTaskFlowStatus} from '../actions/task_flow';
import {updateUnionTaskFlowReportMap, updateUnionTaskFlowStatus} from '../actions/union_task_flow';

let rws: ReconnectingWebSocket;

function onOpen() {
    log.info('Socket Connect Success');
    sendSocketMessage(SocketMessageType.USER_ENTER, store.getState().user.owner.id || '');
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
        const unionTaskFlowState = store.getState().unionTaskFlow;
        switch (messageType) {
            case SocketMessageType.TASK_UPDATE:
                const updateMessageList = messageCon.match(/^([^\|]+)\|([^\|]+)\|([\S\s]+)$/);
                if (!updateMessageList) {
                    return;
                }
                const updateMessageHead = updateMessageList[1].split('-');
                const updateTaskReportType = parseInt(updateMessageHead[0], 10);
                const updateTaskId = updateMessageHead[1];
                const updateIndex = updateMessageList[2];
                const updateMessageData = JSON.parse(updateMessageList[3]);
                const reportData: ITaskReportDetailItem = {
                    index: updateIndex,
                    ...updateMessageData
                };
                // Check task type
                switch (updateTaskReportType) {
                    case TaskReportType.TASK:
                        if (!(taskFlowState.detail._id && updateTaskId === taskFlowState.detail._id)) {
                            return;
                        }
                        store.dispatch(updateTaskFlowReportMap(reportData));
                        return;
                    case TaskReportType.UNION_TASK:
                        if (!(unionTaskFlowState.detail._id && updateTaskId === unionTaskFlowState.detail._id)) {
                            return;
                        }
                        store.dispatch(updateUnionTaskFlowReportMap(reportData));
                        return;
                }
                break;
            case SocketMessageType.TASK_END:
                const endMessageList = messageCon.match(/^([^\|]+)\|([^\|]+)$/);
                if (!endMessageList) {
                    return;
                }
                const endMessageHead = endMessageList[1].split('-');
                const endTaskReportType = parseInt(endMessageHead[0], 10);
                const endTaskId = endMessageHead[1];
                const endTaskMessage = endMessageList[2];
                switch (endTaskReportType) {
                    case TaskReportType.TASK:
                        if (!(taskFlowState.detail._id && endTaskId === taskFlowState.detail._id)) {
                            return;
                        }
                        store.dispatch(updateTaskFlowStatus(parseInt(endTaskMessage, 10)));
                        return;
                    case TaskReportType.UNION_TASK:
                        if (!(unionTaskFlowState.detail._id && endTaskId === unionTaskFlowState.detail._id)) {
                            return;
                        }
                        store.dispatch(updateUnionTaskFlowStatus(parseInt(endTaskMessage, 10)));
                        return;
                }
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
