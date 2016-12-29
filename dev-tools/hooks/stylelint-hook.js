#!/usr/bin/node
const childProcess = require('child_process');
const path = require('path');

// process.chdir('src/main/webapp/static');
const files = childProcess.execSync('hg status -man -I "glob:**/*.scss" .').toString().replace(/[\r|\n]/g, ' ');
if (!files) {
    process.exit(0);
}
const cmd = `${path.normalize('./node_modules/.bin/stylelint')} ${files} --color`;
childProcess.exec(cmd, {maxBuffer: 10 * 1024 * 1024}, (err, stdio, stderr) => {
    if (err) {
        /* eslint-disable no-console */
        console.log('stylelint error:');
        console.log(stdio || err);
        process.exit(1);
    }
    process.exit(0);
});
