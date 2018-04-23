const gulp = require('gulp');
const fs = require('fs-extra');
const webpack = require('webpack');
const webConnect = require('gulp-connect');
const eliminator = require('./plugins/eliminator');
const bundler = require('./plugins/bundler');

module.exports = function (setting) {
    let dir = setting.dir;
    let tmpClient = `${setting.dir.build}/tmp/client`;

    gulp.task('client:sw', () => {
        if (setting.is(setting.target, 'cordova')) return;
        let target = setting.buildPath(setting.target);
        let serviceWorkers = ['service-worker.js'];
        let timestamp = Date.now();
        const files = getFilesList(`${dir.buildClient}/${target}`, '').join('","');
        for (let i = 0, il = serviceWorkers.length; i < il; ++i) {
            setting.findInFileAndReplace(`${dir.srcClient}/${serviceWorkers[i]}`, /__TIMESTAMP__/g, timestamp, `${dir.buildClient}/${target}`);
            setting.findInFileAndReplace(`${dir.buildClient}/${target}/${serviceWorkers[i]}`, "__FILES__", `"${files}"`, `${dir.buildClient}/${target}`);
        }
    });

    gulp.task('client:preBuild', () => {
        setting.clean(tmpClient);
        bundler(setting, getEntry(`${setting.dir.srcClient}/app`), tmpClient);
        return gulp.src(`${tmpClient}/**/*.ts*`)
            .pipe(eliminator(setting))
            .pipe(gulp.dest(tmpClient))
    });

    gulp.task('client:build', ['client:preBuild'], () => {
        // copying conf.var to target on production mode [in case of not using deploy system]
        if (setting.production) {
            fs.copySync(`${setting.dir.resource}/gitignore/config.var.ts`, `${tmpClient}/client/app/config/config.var.ts`);
        }
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
        runWebServer(root);
    });

    gulp.task(`client:watch`, () => {
        gulp.watch([`${dir.srcClient}/**/*.ts*`], [`client:build`, `client:sw`]);
    });

    gulp.task(`sw:watch`, () => {
        gulp.watch([`${dir.srcClient}/*.js`], [`client:sw`]);
    });

    return {
        watch: ['client:watch', 'sw:watch'],
        tasks: ['client:build', "client:sw", 'client:run']
    };

    function getWebpackConfig() {
        let plugins = [
            new webpack.optimize.CommonsChunkPlugin({
                name: "lib",
                minChunks: function (module) {
                    // console.log(module.context);
                    return module.context && module.context.indexOf("node_modules") !== -1;
                }
            }),
            new webpack.ProvidePlugin({
                '__assign': ['tslib', '__assign'],
                '__extends': ['tslib', '__extends'],
            })
        ];
        if (setting.production) {
            plugins = plugins.concat([
                new webpack.DefinePlugin({
                    'process.env': { NODE_ENV: '"production"' }
                }),
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                }),
                new webpack.optimize.UglifyJsPlugin({
                    sourceMap: false,
                    warnings: false,
                })
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
                    { test: /\.tsx?$/, loader: `awesome-typescript-loader?sourceMap=${!setting.production}` },
                    { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
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

        webConnect.server({
            root: [wwwRoot],
            livereload: true,
            port: setting.port.http
        });

        gulp.watch([assets], function () {
            gulp.src(assets).pipe(webConnect.reload());
        });
    }

    function getFilesList(dir, base) {
        let files = [];
        const thisList = fs.readdirSync(dir);
        for (let i = 0, il = thisList.length; i < il; ++i) {
            const thisPath = `${dir}/${thisList[i]}`;
            const stat = fs.statSync(thisPath);
            if (stat.isFile()) {
                files.push(`${base}${thisList[i]}`);
            } else {
                files = files.concat(getFilesList(`${dir}/${thisList[i]}`, `${base}${thisList[i]}/`));
            }
        }
        return files;
    }
};