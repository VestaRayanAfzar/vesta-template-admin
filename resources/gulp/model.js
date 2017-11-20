let gulp = require('gulp');
let ts = require('gulp-typescript');

module.exports = function (setting) {
    let dir = setting.dir;
    let buildPath = `${dir.build}/tmp/cmn`;

    gulp.task('model:compile', () => {
        let tsFiles = [`${dir.srcClient}/app/cmn/**/*.ts`];
        let stream = gulp.src(tsFiles);
        let tsResult = stream.pipe(ts({
            target: 'es5',
            module: 'commonjs'
        }));
        return tsResult.js.pipe(gulp.dest(`${buildPath}/model`));
    });

    return {
        tasks: ['model:compile'],
        watch: []
    };
};
