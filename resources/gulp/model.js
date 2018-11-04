const { src, dest, series } = require("gulp");
const ts = require("gulp-typescript");

module.exports = function(setting) {
    const dir = setting.dir;
    const buildPath = `${dir.build}/tmp`;

    function medium() {
        return compile(`${dir.src}/app/medium.ts`, buildPath);
    }

    function cmn() {
        return compile(`${dir.src}/app/cmn/**/*.ts`, `${buildPath}/cmn`);
    }

    function compile(files, destination) {
        let tsFiles = [files];
        let stream = src(tsFiles);
        let tsResult = stream.pipe(ts({
            target: "es5",
            noEmitHelpers: false,
            module: "commonjs"
        }));
        return tsResult.js.pipe(dest(destination));
    }

    series(medium, cmn);

    return {};
};