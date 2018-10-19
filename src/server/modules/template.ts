import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

import config from './config';

const templatePath = path.join(__dirname, '../../views/index.html');
const templateFile = fs.readFileSync(templatePath);

export default function(): Promise<Handlebars.TemplateDelegate> {
    if (config.templateCache) {
        return Promise.resolve(Handlebars.compile(templateFile.toString()));
    } else {
        return new Promise((resolve, reject) => {
            fs.readFile(templatePath, (err, str) => {
                if (err) {
                    return reject(err);
                }
                resolve(Handlebars.compile(str.toString()));
            });
        });
    }
}
