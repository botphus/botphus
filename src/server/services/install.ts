import {queryUserTotalCount} from './user';

let closeInstall: boolean = false;

/**
 * Check install status
 * @return {Promise<boolean>} True: can't install, Fasle: need install
 */
export function checkInstallStatus(): Promise<boolean> {
    if (closeInstall) {
        return Promise.resolve(closeInstall);
    }
    return queryUserTotalCount()
        .then((count) => {
            closeInstall = count !== 0;
            return closeInstall;
        });
}
