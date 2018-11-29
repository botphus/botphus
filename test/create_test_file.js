'use strict';
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const overridePath = path.join(__dirname, '../config/override.json');
const overrideBackupPath = path.join(__dirname, '../config/override.json.bak');
const overrideHookPath = path.join(__dirname, '../dist/server/hooks/');
const overrideHookBackupPath = path.join(__dirname, '../dist/server/hooks_backup/');

// If files has been existed, rename it
if (fs.existsSync(overridePath) && !fs.existsSync(overrideBackupPath)) {
    fse.moveSync(overridePath, overrideBackupPath);
}
if (fs.existsSync(overrideHookPath) && !fs.existsSync(overrideHookBackupPath)) {
    fse.moveSync(overrideHookPath, overrideHookBackupPath);
}

fse.copySync(path.join(__dirname, './override.json'), overridePath);
fse.copySync(path.join(__dirname, './hooks/'), overrideHookPath);