import * as fs from 'fs-extra';
import * as path from 'path';

import {ISystemConfig} from '../interfaces/common';

// Default config data
const defaultConf = fs.readJsonSync(path.join(process.cwd(), '/config/default.json'));
// Override config data, if nonexistence, it will be null
const overrideConf = fs.readJsonSync(path.join(process.cwd(), '/config/override.json'), {
    throws: false
});

const exportConfig: ISystemConfig = Object.assign({}, defaultConf, overrideConf);

// export result
export default exportConfig;
