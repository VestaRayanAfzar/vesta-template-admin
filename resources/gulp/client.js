let gulp = require('gulp');
let fs = require('fs');
let webpack = require('webpack');
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
    
    gulp.task('client:build', ['client:preBuild'], () => {
        let webpackConfig = getWebpackConfig();
        const compiler = webpack(webpackConfig);
        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    console.error(err);
                    // if (err.details) {
                    //     console.error(err.details);
                    // }
                    return reject(false);
                }
                const info = stats.toJson();
                if (stats.hasErrors()) {
                    process.stderr.write(info.errors.join('\n\n'));
                }
                // if (stats.hasWarnings()) {
                //     console.warn(info.warnings)
                // }
                resolve(true);
            });
        })
    });
    
    gulp.task('client:run', function () {
        if (setting.production) return;
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

    function getWebpackConfig() {
        let plugins = [
            new webpack.optimize.CommonsChunkPlugin({
                name: "lib",
                minChunks: function (module) {
                    // console.log(module.context);
                    return module.context && module.context.indexOf("node_modules") !== -1;
        }
            })
        ];
        if (setting.production) {
            plugins = plugins.concat([
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
            }),
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
            }),
                new webpack.optimize.UglifyJsPlugin()
            ]);
    }
        let target = setting.buildPath(setting.target);
        return {
            entry: {
                app: getEntry(`${tmpClient}/client/app`)
            },
            output: {
                filename: "[name].js",
                path: `${dir.buildClient}/${target}/js`
            },
            devtool: "source-map",
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"]
            },
            module: {
                rules: [
                    {test: /\.tsx?$/, loader: `awesome-typescript-loader?sourceMap=${!setting.production}`},
                    {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
                ]
            },
            plugins,
            externals: {},
        }
    }

    function getEntry(baseDirectory) {
        let entry = `${baseDirectory}/${setting.target}.ts`;
        if (fs.existsSync(entry)) return entry;
        if (setting.is(setting.target, 'cordova')) {
            entry = `${baseDirectory}/cordova.ts`;
            if (fs.existsSync(entry)) return entry;
        }
        entry = `${baseDirectory}/app.ts`;
        return entry;
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
