'use strict';
const fs = require('fs-extra');
const path = require('path');

fs.copySync(path.join(__dirname, './override.json'), path.join(__dirname, '../config/override.json'));