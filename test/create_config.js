'use strict';
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const overridePath = path.join(__dirname, '../config/override.json');
const overrideBackupPath = path.join(__dirname, '../config/override.json.bak');

// If override has been existed, rename it
if (fs.existsSync(overridePath) && !fs.existsSync(overrideBackupPath)) {
    fse.moveSync(overridePath, overrideBackupPath);
}

fse.copySync(path.join(__dirname, './override.json'), overridePath);