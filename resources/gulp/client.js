const webpack = require("webpack");
const webConnect = require("gulp-connect");
const { src, watch, parallel, series } = require("gulp");
const { copySync, readdirSync, statSync } = require("fs");
const { getWebpackConfig } = require("./config");

module.exports = function(setting) {
    const dir = setting.dir;

    function serviceWorkers(cb) {
        if (setting.is(setting.target, "cordova")) return;
        let target = setting.buildPath(setting.target);
        let serviceWorkers = ["service-worker.js"];
        let timestamp = Date.now();
        const files = getFilesList(`${dir.build}/${target}`, "").join('","');
        for (let i = 0, il = serviceWorkers.length; i < il; ++i) {
            setting.findInFileAndReplace(`${dir.src}/${serviceWorkers[i]}`, /__TIMESTAMP__/g, timestamp, `${dir.build}/${target}`);
            setting.findInFileAndReplace(`${dir.build}/${target}/${serviceWorkers[i]}`, "__FILES__", `"${files}"`, `${dir.build}/${target}`);
        }
        cb();
    }

    function compile() {
        const wpConfig = getWebpackConfig(setting);
        wpConfig.entry = { app: `${dir.src}/app/app.ts` };
        wpConfig.optimization.splitChunks = {
            cacheGroups: {
                commons: { test: /[\\/]node_modules[\\/]/, name: "lib", chunks: "all" }
            }
        };
        if (setting.production || setting.is(setting.target, "cordova")) {
            copySync(`${dir.resource}/gitignore/variantConfig.ts`, `${dir.src}/app/config/variantConfig.ts`);
        }
        const compiler = webpack(wpConfig);
        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    console.error(err);
                    return reject(false);
                }
                const info = stats.toJson();
                if (stats.hasErrors()) {
                    process.stderr.write(info.errors.join("\n\n"));
                }
                resolve(true);
            });
        });
    }

    function run() {
        if (setting.production) return;
        let target = setting.buildPath(setting.target);
        let root = `${dir.build}/${target}`;
        switch (setting.target) {
            case "web":
                runWebServer(root);
                break;
            default:
                process.stderr.write(`${setting.target} Develop server is not supported`);
        }
    }

    function watches() {
        watch([`${dir.src}/**/*.ts*`], compile);
        watch([`${dir.src}/*.js`], serviceWorkers);
    }

    function runWebServer(wwwRoot) {
        let assets = `${wwwRoot}/**/*`;

        webConnect.server({
            root: [wwwRoot],
            livereload: true,
            host: "0.0.0.0",
            port: setting.port.http
        });

        watch([assets], function() {
            src(assets).pipe(webConnect.reload());
        });
    }

    function getFilesList(dir, base) {
        let files = [];
        const thisList = readdirSync(dir);
        for (let i = 0, il = thisList.length; i < il; ++i) {
            const thisPath = `${dir}/${thisList[i]}`;
            const stat = statSync(thisPath);
            if (stat.isFile()) {
                files.push(`${base}${thisList[i]}`);
            } else {
                files = files.concat(getFilesList(`${dir}/${thisList[i]}`, `${base}${thisList[i]}/`));
            }
        }
        return files;
    }

    return {
        tasks: parallel(serviceWorkers, series(compile, run)),
        watch: watches,
    };
};