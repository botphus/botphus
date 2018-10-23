import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

import config from './config';

const templatePath = path.join(__dirname, '../../views/index.html');
let templateFunc: Handlebars.TemplateDelegate;

export default function(): Promise<Handlebars.TemplateDelegate> {
    if (templateFunc) {
        return Promise.resolve(templateFunc);
    }
    return new Promise((resolve, reject) => {
        fs.readFile(templatePath, (err, tmpData) => {
            if (err) {
                return reject(err);
            }
            // Check template cache config
            if (config.templateCache) {
                templateFunc = Handlebars.compile(tmpData.toString());
                return resolve(templateFunc);
            }
            resolve(Handlebars.compile(tmpData.toString()));
        });
    });
}
