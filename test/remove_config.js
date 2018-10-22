'use strict';
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const overridePath = path.join(__dirname, '../config/override.json');
const overrideBackupPath = path.join(__dirname, '../config/override.json.bak');

fse.removeSync(overridePath);

// If override config bak has been existed, rename it
if (fs.existsSync(overrideBackupPath)) {
    fse.moveSync(overrideBackupPath, overridePath);
}