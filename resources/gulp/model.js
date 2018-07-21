let gulp = require('gulp');
let ts = require('gulp-typescript');

module.exports = function (setting) {
    let dir = setting.dir;
    let buildPath = `${dir.build}/tmp`;

    gulp.task('model:compile', () => {
        compile(`${dir.src}/app/medium.ts`, buildPath);
        compile(`${dir.src}/app/cmn/**/*.ts`, `${buildPath}/cmn`);
    });

    return {};

    function compile(files, destination) {
        let tsFiles = [files];
        let stream = gulp.src(tsFiles);
        let tsResult = stream.pipe(ts({
            target: 'es5',
            noEmitHelpers: false,
            module: 'commonjs'
        }));
        return tsResult.js.pipe(gulp.dest(destination));
    }
};
