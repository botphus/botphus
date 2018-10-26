import * as puppeteer from 'puppeteer';

import {ITaskRuleSaveItem} from '../server/interfaces/model/task';
import {TaskType, TaskTypeDomSubType, TaskTypeEventSubType} from '../server/types/task';

import config from '../server/modules/config';

// User test data
export const testAdminEmail = 'test-admin@test.com';
export const testPwd = 'test-password';
export const testAdminNickname = 'botphus-admin';
export const testEmail = 'test@test.com';
export const testNickname = 'botphus-user';
export const testEmail2 = 'test2@test.com';
export const sessionReg = new RegExp(`^${config.sessionCookieKey}=([^;]*)(;|)[\\S\\s]*$`);

// Connection test data
export const connectionName = 'test-conenction';
export const connectionMysqlConfig = {
    database: 'botphus_test',
    host: '127.0.0.1',
    password: '',
    port: 3306,
    user: 'travis',
};
export const connectionRedisConfig = {
  host: '127.0.0.1',
  port: 6379
};
export const connectionRedisClusterConfig = [
    {
      host: '127.0.0.1',
      port: 6379
    },
    {
      host: '127.0.0.1',
      port: 6380
    }
];

// Task test data
export const taskName = 'test-task';
const eventTimeout = 1000;
export const taskRuleList: ITaskRuleSaveItem[] = [
    {
        argments: [eventTimeout, (consoleMessage: puppeteer.ConsoleMessage) => {
            return consoleMessage.type() === 'log';
        }],
        assertion: [`consoleMessage.type() === "log"`, 'consoleMessage.args().length === 2', 'consoleMessage.text().indexOf("Upload event:") >= 0'],
        assertionVarName: 'consoleMessage',
        id: 1,
        level: 0,
        name: 'test1',
        pid: 0,
        subType: TaskTypeEventSubType.SUB_TYPE_CONSOLE,
        type: TaskType.TYPE_EVENT,
    },
    {
        argments: [eventTimeout, (request: puppeteer.Request) => {
            return request.url().indexOf('upload.do') >= 0;
        }],
        id: 2,
        level: 1,
        name: 'test2',
        pid: 1,
        subType: TaskTypeEventSubType.SUB_TYPE_REQUEST,
        type: TaskType.TYPE_EVENT
    },
    {
        argments: ['.ant-form-item:nth-child(10) .ant-form-item-children .ant-upload input'],
        id: 3,
        level: 2,
        name: 'test3',
        pid: 2,
        subType: TaskTypeDomSubType.SUB_TYPE_CLICK,
        type: TaskType.TYPE_DOM
    }
];

// Task flow
export const taskFlowName = 'test-task-flow';
export const taskFlowExcludeOption = {
    '0-1': true
};
export const taskFlowStartPage = 'https://cn.bing.com/';
