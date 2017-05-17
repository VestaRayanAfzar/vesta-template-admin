let gulp = require('gulp');
let fs = require('fs');
let spawn = require('child_process').spawn;
let rollup = require('rollup');
let rollupTypescript = require('rollup-plugin-typescript2');
let rollupResolve = require('rollup-plugin-node-resolve');
let rollupCommon = require('rollup-plugin-commonjs');
let rollupReplace = require('rollup-plugin-replace');
let rollupUglify = require('rollup-plugin-uglify');
let rollupProgress = require('rollup-plugin-progress');
let webConnect = require('gulp-connect');
let open = require('open');
let electronServer = require('electron-connect').server;
let eliminator = require('./plugins/eliminator');
let bundler = require('./plugins/bundler');

module.exports = function (setting) {
    let dir = setting.dir;
    let tmpClient = `${setting.dir.build}/tmp/client`;

    gulp.task('client:preBuild', () => {
        setting.clean(tmpClient);
        bundler(setting, getEntry(`${setting.dir.srcClient}/app`), tmpClient);
        return gulp.src(`${tmpClient}/**/*.ts*`)
            .pipe(eliminator(setting, setting.target))
            .pipe(gulp.dest(tmpClient))
    });
    gulp.task('client:build', [`client:preBuild`], () => {
        let rollupConfig = getRollupConfig();
        let bundleConfig = getBundleConfig();

        return rollup.rollup(rollupConfig).then(bundle => bundle.write(bundleConfig))
    });
    gulp.task('client:run', function () {
        let target = setting.buildPath(setting.target);
        let root = `${dir.buildClient}/${target}`;

        switch (setting.target) {
            case 'web':
                runWebServer(root);
                break;
            case 'android':
            case 'ios':
                runCordovaApp(root);
                break;
            case 'electron':
                runElectronServer(root);
                break;
            default:
                process.stderr.write(`${setting.target} Develop server is not supported`);
        }
    });
    gulp.task(`client:watch`, () => {
        gulp.watch([`${dir.srcClient}/**/*.ts*`, `${dir.src}/cmn/**/*`], [`client:build`]);
    });

    return {
        watch: ['client:watch'],
        tasks: ['client:build', 'client:run']
    };

    /**
     * RollUp
     * Documentation: https://github.com/rollup/rollup/wiki/JavaScript-API
     * Plugins: https://github.com/rollup/rollup/wiki/Plugins
     */
    function getRollupConfig() {

        let rollupConfig = {
            entry: getEntry(`${tmpClient}/client/app`),
            treeshake: true
        };
        // Bundle libraries only in case of production, otherwise separate lib file to reduce build time
        if (!setting.production) {
            rollupConfig.external = ['react', 'react-dom', 'react-router-dom'];
            rollupConfig.globals = {
                'react': 'React',
                'react-dom': 'ReactDOM',
                'react-router-dom': 'ReactRouterDOM'
            };
        }
        // configuring plugins
        rollupConfig.plugins = [
            (setting.production && rollupProgress()),
            rollupTypescript({
                check: false,
                clean: true,
                cacheRoot: `${dir.build}/tmp/rpt2_cache`,
                abortOnError: false
            }),
            rollupReplace({
                'process.env.NODE_ENV': setting.production ? '"production"' : '"development"'
            }),
            rollupResolve({jsnext: true, main: true}),
            rollupCommon({
                include: ['node_modules/**'],
            }),
            (setting.production && rollupUglify())
        ];

        return rollupConfig;
    }

    function getBundleConfig() {
        let target = setting.buildPath(setting.target);
        let bundleConfig = {
            format: "iife",
            dest: `${dir.buildClient}/${target}/js/app.js`
        };
        if (!setting.production) {
            bundleConfig.sourceMap = true;
        }
        return bundleConfig;
    }

    function getEntry(baseDirectory) {
        let entry = `${baseDirectory}/${setting.target}.ts`;
        if (fs.existsSync(entry)) return entry;
        if (setting.is(setting.target, 'cordova')) {
            entry = `${baseDirectory}/cordova.ts`;
            if (fs.existsSync(entry)) return entry;
        }
        entry = `${baseDirectory}/app.ts`;
        if (fs.existsSync(entry)) return entry;
        process.stderr.write(`Entry not found ${entry}`);
        process.exit(1);
    }

    function runWebServer(wwwRoot) {
        let assets = `${wwwRoot}/**/*`;
        let url = `http://localhost:${setting.port.http}`;

        webConnect.server({
            root: [wwwRoot],
            livereload: true,
            port: setting.port.http
        });

        setTimeout(open.bind(null, url), 1000);

        gulp.watch([assets], function () {
            gulp.src(assets).pipe(webConnect.reload());
        });
    }

    function runElectronServer(wwwRoot) {
        // // adding to index file
        // let indexFile = `${wwwRoot}/index.html`;
        // let html = fs.readFileSync(indexFile, {encoding: 'utf8'});
        // html = html.replace('</head>', '<script>require("electron-connect").client.create()</script></head>');
        // fs.writeFileSync(indexFile, html);
        // starting electron dev server
        let electronConnect = electronServer.create();
        electronConnect.start();
        // Restart browser process
        gulp.watch(`${wwwRoot}/../app.js`, electronConnect.restart);
        // Reload renderer process
        gulp.watch([`${wwwRoot}/**/*`], electronConnect.reload);
    }

    function runCordovaApp(wwwRoot) {
        // spawn('../../../node_modules/.bin/phonegap', ['serve'], {cwd: `${wwwRoot}/..`, stdio: 'inherit'})
    }
};
