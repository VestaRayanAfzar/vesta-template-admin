const gulp = require('gulp');
const fs = require('fs-extra');
const webpack = require('webpack');
const webConnect = require('gulp-connect');
const eliminator = require('./plugins/eliminator');
const bundler = require('./plugins/bundler');

module.exports = function(setting) {
    let dir = setting.dir;
    let tmpClient = `${setting.dir.build}/tmp`;

    gulp.task('client:sw', () => {
        if (setting.is(setting.target, 'cordova')) return;
        let target = setting.buildPath(setting.target);
        let serviceWorkers = ['service-worker.js'];
        let timestamp = Date.now();
        const files = getFilesList(`${dir.build}/${target}`, '').join('","');
        for (let i = 0, il = serviceWorkers.length; i < il; ++i) {
            setting.findInFileAndReplace(`${dir.src}/${serviceWorkers[i]}`, /__TIMESTAMP__/g, timestamp, `${dir.build}/${target}`);
            setting.findInFileAndReplace(`${dir.build}/${target}/${serviceWorkers[i]}`, "__FILES__", `"${files}"`, `${dir.build}/${target}`);
        }
    });

    gulp.task('client:preBuild', () => {
        setting.clean(tmpClient);
        bundler(setting, getEntry(`${setting.dir.src}/app`), tmpClient);
        return gulp.src(`${tmpClient}/**/*.ts*`)
            .pipe(eliminator(setting))
            .pipe(gulp.dest(tmpClient))
    });

    gulp.task('client:build', ['client:preBuild'], () => {
        // copying conf.var to target on production mode [in case of not using deploy system]
        if (setting.production || setting.is(setting.target, 'cordova')) {
            fs.copySync(`${setting.dir.resource}/gitignore/variantConfig.ts`, `${tmpClient}/client/app/config/variantConfig.ts`);
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

    gulp.task('client:run', function() {
        if (setting.production) return;
        let target = setting.buildPath(setting.target);
        let root = `${dir.build}/${target}`;
        runWebServer(root);
    });

    gulp.task(`client:watch`, () => {
        gulp.watch([`${dir.src}/**/*.ts*`], [`client:build`, `client:sw`]);
    });

    gulp.task(`sw:watch`, () => {
        gulp.watch([`${dir.src}/*.js`], [`client:sw`]);
    });

    return {
        watch: ['client:watch', 'sw:watch'],
        tasks: ['client:build', "client:sw", 'client:run']
    };

    function getWebpackConfig() {
        let plugins = [
            new webpack.ProvidePlugin({
                '__assign': ['tslib', '__assign'],
                '__extends': ['tslib', '__extends'],
            })
        ];
        let target = setting.buildPath(setting.target);
        const wpConfig = {
            entry: {
                app: getEntry(`${tmpClient}/app`)
            },
            output: {
                filename: "[name].js",
                path: `${dir.build}/${target}/js`
            },
            mode: setting.production ? "production" : "development",
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"]
            },
            module: {
                rules: [
                    { test: /\.tsx?$/, loader: `ts-loader` },
                    // { test: /\.js$/, loader: "source-map-loader", enforce: "pre" },
                ]
            },
            plugins,
            externals: {},
            optimization: {
                splitChunks: {
                    cacheGroups: {
                        commons: { test: /[\\/]node_modules[\\/]/, name: "lib", chunks: "all" }
        }
    }
        }
    }
        if (!setting.production) {
            wpConfig.devtool = "inline-source-map";
        }
        return wpConfig;
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

        gulp.watch([assets], function() {
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