import ILocalePackage from '../../../src/server/interfaces/locale';
import {defaultPageSize} from '../../../src/server/types/common';
import * as rules from '../../../src/server/types/rules';

// Set language package: pack in "webpack.config.js" alias
// @ts-ignore: next
import localeSystem from 'localeSystem';

import {$app} from './util';

// Client protocol
export const protocol = window.location.protocol;
// Client salt
export const salt = $app.getAttribute('data-salt') || '';
// Socket server
const socket = $app.getAttribute('data-socket') || '';
// If socket is number, build websocket server. otherwise, set socket server with socket
export const socketServer = /^\d+$/.test(socket) ? `${protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:${socket}` : socket;
// Auth login
export const authLogin = $app.getAttribute('data-auth-login') === 'true';

// Client language package
export const localePkg: ILocalePackage = localeSystem;

// Page size
export const pageSize = defaultPageSize;

// Form valid Rules
export const formValidRules = rules;

export const welcomePageLayout = {
    lg: 12,
    md: 16,
    span: 20,
    xl: 10,
    xxl: 8
};

// Form item laytout
export const formItemLayout = {
    labelCol: {
        sm: { span: 6 },
        xs: { span: 24 },
    },
    wrapperCol: {
        sm: { span: 14 },
        xs: { span: 24 },
    }
};

// Form inline item layout for search form
export const formInlineItemLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
};

// Form button layout
export const tailFormItemLayout = {
    wrapperCol: {
        sm: {
            offset: 6,
            span: 14,
        },
        xs: {
            offset: 0,
            span: 24,
        },
    }
};

// Date format string
export const dateFormat = 'YYYY-MM-DD HH:mm:ss';
export const dateFormatOnlyDate = 'YYYY-MM-DD';
