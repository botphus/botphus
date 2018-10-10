import * as fs from 'fs-extra';
import * as path from 'path';

// Default config data
const defaultConf = fs.readJsonSync(path.join(process.cwd(), '/config/default.json'));
// Override config data, if nonexistence, it will be null
const overrideConf = fs.readJsonSync(path.join(process.cwd(), '/config/override.json'), {
    throws: false
});

// export result
export default Object.assign({}, defaultConf, overrideConf);
