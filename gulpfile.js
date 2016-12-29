const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const del = require('del');
const webpack = require('webpack');
const argv = require('yargs')
    .alias('d', 'develop')
    .argv;
const path = require('path');
const spawn = require('child_process').spawn;
const fs = require('fs');

const isDev = !!argv.develop;
process.env.NODE_ENV = isDev ? 'develop' : 'production';

// note: import webpack AFTER setting process.env.NODE_ENV
const webpackConfig = require('./webpack.config.js');

gutil.log(`It's on ${process.env.NODE_ENV} mode`);

gulp.task('clean', function (done) {
    del.sync(webpackConfig.output.path);
    done();
});

gulp.task('build', ['clean'], function (done) {
    webpack(webpackConfig, (fatalError, stats) => {
        if (fatalError) {
            throw new gutil.PluginError('webpack', fatalError);
        }
        const jsonStats = stats.toJson();
        const buildError = jsonStats.errors[0] || jsonStats.warnings[0];
        if (buildError) {
            if (!isDev) {
                throw new gutil.PluginError('webpack', buildError);
            } else {
                gutil.log(buildError);
            }
        } else {
            gutil.log('[webpack]', stats.toString({
                colors: true,
                version: false,
                hash: false,
                timings: false,
                chunks: false,
                chunkModules: false,
            }));

            if (!isDev) {
                done();
                // save the profile file，npm run analyze to visualize the bundle profile info
                fs.writeFileSync('./build/bundle_stats.json', JSON.stringify(jsonStats));
            }
        }
    });
});

gulp.task('install-hooks', (done) => {
    function install(hookFile, configContent, oldConfigContent) {
        return new Promise((resolve, reject) => {
            const hgDir = path.resolve('.hg');
            const hgConfigFile = path.resolve(hgDir, 'hgrc');
            let hgConfigContent = fs.readFileSync(hgConfigFile).toString();
            const hasContent = hgConfigContent.indexOf(configContent) !== -1;
            function copyHookFile() {
                gulp.src([hookFile])
                    .pipe(gulp.dest(hgDir))
                    .on('end', resolve);
            }
            function cleanOldConfig() {
                while (hgConfigContent.indexOf(oldConfigContent) !== -1) {
                    hgConfigContent = hgConfigContent.replace(oldConfigContent, '');
                }
            }
            if (!hasContent) {
                if (oldConfigContent) {
                    cleanOldConfig();
                }
                hgConfigContent += configContent;
                fs.writeFile(hgConfigFile, hgConfigContent, (err) => {
                    if (err) throw err;
                    copyHookFile();
                });
            } else {
                copyHookFile();
            }
        });
    }

    const oldEslintConfig = '\n[hooks]\npretxncommit.tslint = node ".hg/tslint-hook.js"\n\n';
    const newEslintConfig = '\n[hooks]\nprecommit.tslint = node ".hg/tslint-hook.js"\n\n';
    const oldStyleLintConfig = '\n[hooks]\npretxncommit.stylelint = node ".hg/stylelint-hook.js"\n\n';
    const newStyleLintConfig = '\n[hooks]\nprecommit.stylelint = node ".hg/stylelint-hook.js"\n\n';

    install('./dev-tools/hooks/tslint-hook.js', newEslintConfig, oldEslintConfig)
        .then(() => install('./dev-tools/hooks/stylelint-hook.js', newStyleLintConfig, oldStyleLintConfig))
        .then(done);
});

gulp.task('server', (done) => {
    const child = spawn('node', ['./src/server/index.js']);
    child.stdout.on('data', data => gutil.log(data.toString()));
    child.stderr.on('data', data => gutil.log(data.toString()));
    child.on('exit', () => gutil.log('the web server is stopped'));
});

gulp.task('default', isDev ? ['build', 'server'] : () => runSequence('build', 'server'));
