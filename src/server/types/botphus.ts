import {ITaskStartOption} from 'botphus-core';
import {LaunchOptions, NavigationOptions} from 'puppeteer';

import {IIndexMap} from '../interfaces/common';

/**
 * Normal page startOption, If windows use sandbox mode, else use no-sandbox mode
 */
const normalPagePuppeteerLaunchOption: LaunchOptions = process.platform === 'win32' ? {
    ignoreHTTPSErrors: true
} : {
    args: ['--no-sandbox'],
    ignoreHTTPSErrors: true
};

/**
 * Normal page startPageOption
 * @type {Object}
 */
const normalPageStartPageOption: NavigationOptions = {
    waitUntil: 'networkidle2'
};

export const defaultStartOption: IIndexMap<ITaskStartOption> = {
    NORMAL: {
        puppeteerLaunchOption: normalPagePuppeteerLaunchOption,
        startPageOption: normalPageStartPageOption
    },
    SINGLE_PAGE: {
        // Add slowMo for human like
        puppeteerLaunchOption: {
            ...normalPagePuppeteerLaunchOption,
            slowMo: 20
        },
        // Add waitUntil for async resouce loading
        startPageOption: {
            ...normalPageStartPageOption,
            waitUntil: 'networkidle0'
        }
    }
};
