let http = require('http');
let gulp = require('gulp');
let server = require('gulp-develop-server');
let chalk = require('chalk');
let path = require('path');
let ts = require('gulp-typescript');
let map = require('gulp-sourcemaps');


module.exports = function (setting) {
    let dir = setting.dir;

    gulp.task('server:ts', () => {
        let tsFiles = [`${dir.srcServer}/**/*.ts`];
        let genSourceMap = !setting.production;
        let stream = gulp.src(tsFiles);
        if (genSourceMap) stream = stream.pipe(map.init());
        let tsResult = stream.pipe(ts({
            target: 'es2015',
            module: 'commonjs',
            removeComments: setting.production
        }));
        return genSourceMap ?
            tsResult.js.pipe(map.write()).pipe(gulp.dest(dir.buildServer)) :
            tsResult.js.pipe(gulp.dest(dir.buildServer));
    });

    gulp.task('server:watch', function () {
        return gulp.watch([`${dir.srcServer}/**/*`], ['dev:server']);
    });

    return {
        tasks: ['server:ts'],
        watch: ['server:watch']
    };
};

/**
 * This tasks is called by npm script for starting api server in docker env
 */
gulp.task('server:run', function () {
    let {dir, debug} = require('./config');
    // let composeFile = `${dir.buildServer}/docker-compose.yml`;
    let delay = 500, debuggerDelay = 500, timer, debuggerTimer;
    let port = debug.ports[debug.type];
    server.listen({path: `${dir.buildServer}/app.js`, execArgv: [`--${debug.type}=0.0.0.0:${port}`]});
    let isInspect = debug.type === 'inspect';
    isInspect && loadDebugger();
    gulp.watch([`${dir.buildServer}/**/*.js`, `!${dir.buildServer}/static/**/*.js`], function () {
        clearTimeout(timer);
        clearTimeout(debuggerTimer);
        timer = setTimeout(() => {
            server.restart();
            isInspect && loadDebugger();
        }, delay);
    });

    function loadDebugger() {
        debuggerTimer = setTimeout(launchInspector, debuggerDelay);

        function launchInspector() {
            http.get(`http://${debug.address}:${debug.ports.inspect}/json`, res => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', chunk => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    let data = JSON.parse(rawData);
                    let url = data[0]['devtoolsFrontendUrl'];
                    let regex = new RegExp(`&ws=[^:]+:${debug.ports.inspect}\/`);
                    url = url.replace(regex, `&ws=${debug.address}:${debug.ports.inspect}/`);
                    process.stdout.write(`\n\nInspect URL: "${chalk.cyan(url)}"\n\n`);
                })
            }).on('error', err => process.stderr.write(err.message));
        }
    }
});



