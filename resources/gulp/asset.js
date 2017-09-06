let gulp = require('gulp');
let uglify = require('gulp-uglify');
let htmlMin = require('gulp-htmlmin');
let replace = require('gulp-replace');
// let imgOptimize = require('gulp-image-optimization');

module.exports = function (setting) {
    let dir = setting.dir;

    gulp.task('asset:html', function () {
        let target = setting.buildPath(setting.target);
        let stream = gulp.src(`${dir.srcClient}/index.html`);
        if (setting.is(setting.target, 'cordova')) {
            stream = stream.pipe(replace(`<script src="js/lib.js"></script>`, `<script src="js/lib.js"></script>\n<script src="cordova.js"></script>`));
        }
        if (setting.production) {
            stream = minifyHtml(stream).on('error', setting.error);
        }
        return stream.pipe(gulp.dest(`${dir.buildClient}/${target}`));
    });

    gulp.task('asset:etc', ['asset:html'], function () {
        let target = setting.buildPath(setting.target);
        return gulp.src([`${dir.srcClient}/*`, `!${dir.srcClient}/index.html`])
            .pipe(gulp.dest(`${dir.buildClient}/${target}`));
    });

    gulp.task('asset:font', function () {
        let target = setting.buildPath(setting.target);
        return gulp.src([`${dir.srcClient}/fonts/**/*`])
            .pipe(gulp.dest(`${dir.buildClient}/${target}/fonts`));
    });

    gulp.task('asset:image', function () {
        let target = setting.buildPath(setting.target);
        let stream = gulp.src(`${dir.srcClient}/images/**/*`);
        // if (setting.production) {
        //     stream = stream.pipe(imgOptimize({
        //         optimizationLevel: 5,
        //         progressive: true,
        //         interlaced: true
        //     })).on('error', setting.error);
        // }
        return stream.pipe(gulp.dest(`${dir.buildClient}/${target}/img`));
    });

    gulp.task('asset:watch', function () {
        gulp.watch([`${dir.srcClient}/*`], ['asset:etc']);
        gulp.watch([`${dir.srcClient}/images/**/*`], ['asset:image']);
    });

    return {
        watch: ['asset:watch'],
        tasks: ['asset:etc', 'asset:font', 'asset:image']
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

    function getDate() {
        let d = new Date();
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    }
};