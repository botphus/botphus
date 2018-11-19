import * as fs from 'fs';
import * as path from 'path';

import {IBotphusHook} from '../interfaces/hook';
import {HookType} from '../types/hook';

import {app} from './util';

/**
 * Hook map
 */
const hookMap: Map<HookType, any> = new Map();

/**
 * Add a hook
 * @param {IBotphusHook} hookData Hook data
 */
export function addHook(hookData: IBotphusHook): void {
    hookMap.set(hookData.type, hookData.hookFunc);
}

/**
 * Get a hook
 * @param  {HookType}           hookType Hook type
 * @return {() => Promise<any>}          Hook return function
 */
export function getHook(hookType: HookType): () => Promise<any> {
    return hookMap.get(hookType) || function __() {
        return Promise.resolve();
    };
}

/**
 * Check has hook or not
 * @param  {HookType} hookType Hook type
 * @return {boolean}           Hook return function
 */
export function hasHook(hookType: HookType): boolean {
    return hookMap.has(hookType);
}

/**
 * Load hook file
 * @return {Promise<void>} Promise function
 */
export function loadHook(): Promise<void> {
    app.log.debug('Load hook start');
    const hookPath = path.join(__dirname, '../hooks/index.js');
    return new Promise((resolve) => {
        fs.stat(hookPath, (err, stats) => {
            // If not err & is hook file, require it
            if (!err && stats.isFile()) {
                app.log.debug('Find hook file, loading...');
                require(hookPath);
            }
            app.log.debug('Load hook end');
            resolve();
        });
    });
}
