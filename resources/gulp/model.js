let gulp = require('gulp');
let ts = require('gulp-typescript');
let fs = require('fs');


module.exports = function (setting) {
    let dir = setting.dir;
    let buildPath = `${dir.build}/tmp/cmn`;

    gulp.task('model:compile', () => {
        let tsFiles = [`${dir.srcClient}/app/cmn/**/*`, `${dir.srcClient}/app/medium.ts`];
        let stream = gulp.src(tsFiles);
        let tsResult = stream.pipe(ts({
            target: 'es5',
            module: 'commonjs'
        }));
        return tsResult.js.pipe(gulp.dest(`${buildPath}/model`));
    });

    gulp.task('model:ts', ['model:compile'], () => {
        fs.renameSync(`${buildPath}/model/medium.js`, `${buildPath}/medium.js`);
    });

    return {
        tasks: ['model:ts'],
        watch: []
    };
};
