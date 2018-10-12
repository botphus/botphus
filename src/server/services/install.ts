import {queryUserTotalCount} from './user';

let closeInstall: boolean = false;

/**
 * Check install status
 * @return {Promise<boolean>} True: need install, Fasle: can't install
 */
export function checkInstallStatus(): Promise<boolean> {
    if (closeInstall) {
        return Promise.resolve(false);
    }
    return queryUserTotalCount()
        .then((count) => {
            closeInstall = count !== 0;
            return !closeInstall;
        });
}
