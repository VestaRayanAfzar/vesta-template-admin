const gulp = require('gulp');
const htmlMin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const eliminator = require('./plugins/eliminator');

module.exports = function (setting) {
    let dir = setting.dir;
    gulp.task('asset:html', function () {
        let target = setting.buildPath(setting.target);
        let timestamp = Date.now();
        let stream = gulp.src(`${dir.srcClient}/index.html`)
            .pipe(eliminator(setting))
            .pipe(replace('__TIMESTAMP__', timestamp));
        if (setting.production) {
            stream = minifyHtml(stream).on('error', setting.error);
        }
        return stream.pipe(gulp.dest(`${dir.buildClient}/${target}`));
    });

    gulp.task('asset:etc', ['asset:html'], function () {
        let target = setting.buildPath(setting.target);
        return gulp.src([`${dir.srcClient}/*`, `!${dir.srcClient}/index.html`, `!${dir.srcClient}/*.js`])
            .pipe(gulp.dest(`${dir.buildClient}/${target}`));
    });

    gulp.task('asset:font', function () {
        let target = setting.buildPath(setting.target);
        gulp.src([`${dir.npm}/md-font/iconfont/*.{eot,ijmap,svg,ttf,woff,woff2}`])
            .pipe(gulp.dest(`${dir.buildClient}/${target}/fonts/material-icon`));
        return gulp.src([`${dir.srcClient}/fonts/**/*`])
            .pipe(gulp.dest(`${dir.buildClient}/${target}/fonts`));
    });

    gulp.task('asset:image', function () {
        let target = setting.buildPath(setting.target);
        let stream = gulp.src(`${dir.srcClient}/images/**/*`);
        return stream.pipe(gulp.dest(`${dir.buildClient}/${target}/img`));
    });

    gulp.task('asset:watch', function () {
        gulp.watch([`${dir.srcClient}/*`, `!${dir.srcClient}/*.js`], ['asset:etc']);
        gulp.watch([`${dir.srcClient}/fonts/**/*`], ['asset:font']);
        gulp.watch([`${dir.srcClient}/images/**/*`], ['asset:image']);
    });

    return {
        watch: ['asset:watch'],
        // run in parallel
        tasks: [['asset:etc', 'asset:font', 'asset:image']]
    };

    function minifyHtml(stream) {
        return stream.pipe(htmlMin({
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            keepClosingSlash: true
        }))
    }
};