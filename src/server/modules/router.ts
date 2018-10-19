import * as path from 'path';
import * as recursive from 'recursive-readdir';

import {app} from './util';

export default function(): Promise<void> {
    const routerPath = path.join(__dirname, '../controllers/');
    return recursive(routerPath).then((files) => {
        files.forEach((filePath) => {
            const pathInfo = path.parse(path.relative(routerPath, filePath));
            const curPrefix = ((pathInfo.dir ? '/' + pathInfo.dir : '') + '/' + (pathInfo.name === 'index' ? '' : pathInfo.name + '/')).replace(/_/g, '-');
            app.log.debug(filePath, curPrefix);
            // Load controllers
            app.register(require(filePath), {
                prefix: curPrefix
            });
        });
    });
}
