'use strict';
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const overridePath = path.join(__dirname, '../config/override.json');
const overrideBackupPath = path.join(__dirname, '../config/override.json.bak');
const overrideHookPath = path.join(__dirname, '../dist/server/hooks/');
const overrideHookBackupPath = path.join(__dirname, '../dist/server/hooks_backup/');

fse.removeSync(overridePath);
fse.removeSync(overrideHookPath);

// If override files bak has been existed, rename it
if (fs.existsSync(overrideBackupPath)) {
    fse.moveSync(overrideBackupPath, overridePath);
}
if (fs.existsSync(overrideHookBackupPath)) {
    fse.moveSync(overrideHookBackupPath, overrideHookPath);
}