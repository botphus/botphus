import ILocalePackage from '../../../src/server/interfaces/locale';

// Set language package: pack in "webpack.config.js" alias
// @ts-ignore: next
import localeSystem from 'localeSystem';

import {$app} from './util';

export const protocol = window.location.protocol;
// Client salt
export const salt = $app.getAttribute('data-salt');
// Socket server
const socket = $app.getAttribute('data-socket') || '';
// If socket is number, build websocket server. otherwise, set socket server with socket
export const socketServer = /^\d+$/.test(socket) ? `${protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:${socket}` : socket;

export const localePkg: ILocalePackage = localeSystem;
