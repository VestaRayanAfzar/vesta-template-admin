let gulp = require('gulp');
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let postCss = require('gulp-postcss');
let autoPrefixer = require('autoprefixer');
let csswring = require('csswring');
let mqpacker = require('css-mqpacker');
let reporter = require('postcss-reporter');
let doiuse = require('doiuse');
let fs = require('fs');
let eliminator = require('./plugins/eliminator');

module.exports = function (setting) {
    let dir = setting.dir;

    gulp.task('sass:preCompile', () => {
        let tmpDirectory = `${dir.build}/tmp/scss`;
        return gulp.src(`${dir.srcClient}/scss/**/*.scss`)
            .pipe(eliminator(setting, setting.target))
            .pipe(gulp.dest(tmpDirectory))
    });

    gulp.task('sass:compile', ['sass:preCompile'], () => {
        let target = setting.buildPath(setting.target);
        let tmpDirectory = setting.production ? `${dir.build}/tmp/css` : `${dir.buildClient}/${target}/css`;
        let stream = gulp.src(getEntry()),
            genMap = !setting.production;
        if (genMap) stream = stream.pipe(sourcemaps.init());
        stream = stream.pipe(sass()).on('error', setting.error);
        if (genMap) stream = stream.pipe(sourcemaps.write());
        return stream.pipe(gulp.dest(tmpDirectory));
    });

    let browsersToSupport = [
        'last 4 version',
        'iOS >= 7',
        'Android >= 4',
        'Explorer >= 10',
        'ExplorerMobile >= 11'];

    gulp.task('sass:postCss', ['sass:compile'], () => {
        let target = setting.buildPath(setting.target);
        let tmpDirectory = setting.production ? `${dir.build}/tmp/css` : `${dir.buildClient}/${target}/css`;
        let preprocessors = [autoPrefixer({browsers: browsersToSupport})];
        if (setting.production) {
            preprocessors.push(mqpacker);
            preprocessors.push(csswring);
            return gulp.src(tmpDirectory + '/*.css')
                .pipe(postCss(preprocessors))
                .on('error', setting.error)
                .pipe(gulp.dest(`${dir.buildClient}/${target}/css`))
        }
    });

    gulp.task('sass:analyse', ['sass:compile'], () => {
        let target = setting.buildPath(setting.target);
        let tmpDirectory = setting.production ? `${dir.build}/tmp/css` : `${dir.buildClient}/${target}/css`;

        let preprocessors = [
            autoPrefixer({browsers: browsersToSupport}),
            doiuse({browsers: browsersToSupport}),
            reporter()
        ];
        return gulp.src(tmpDirectory + '/*.css')
            .pipe(postCss(preprocessors))
            .on('error', setting.error)
            .pipe(gulp.dest(tmpDirectory + '/analyze'))
    });

    gulp.task('sass:watch', () => {
        return gulp.watch(`${dir.srcClient}/scss/**/*.scss`, ['sass:postCss']);
    });

    return {
        tasks: ['sass:postCss'],
        watch: ['sass:watch']
    };

    function getEntry() {
        let baseDirectory = `${dir.build}/tmp/scss`;
        let entry = `${baseDirectory}/${setting.target}-rtl.scss`;
        if (fs.existsSync(entry)) return [entry, entry.replace('-rtl', '-ltr')];
        if (setting.is(setting.target, 'cordova')) {
            entry = `${baseDirectory}/cordova-rtl.scss`;
            if (fs.existsSync(entry)) return [entry, entry.replace('-rtl', '-ltr')];
        }
        entry = `${baseDirectory}/app-rtl.scss`;
        if (fs.existsSync(entry)) return [entry, entry.replace('-rtl', '-ltr')];
        process.stderr.write(`Entry not found ${entry}`);
        process.exit(1);
    }
};