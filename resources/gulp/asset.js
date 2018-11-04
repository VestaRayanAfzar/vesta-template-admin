const { src, dest, parallel, series, watch } = require("gulp");
const htmlMin = require("gulp-htmlmin");
const replace = require("gulp-replace");
const eliminator = require("./plugins/eliminator");

module.exports = function(setting) {
    let dir = setting.dir;

    function index() {
        const target = setting.buildPath(setting.target);
        const timestamp = Date.now();
        let stream = src(`${dir.src}/index.html`)
            .pipe(eliminator(setting))
            .pipe(replace("__TIMESTAMP__", timestamp));
        if (setting.production) {
            stream = minifyHtml(stream).on("error", setting.error);
        }
        return stream.pipe(dest(`${dir.build}/${target}`));
    }

    function root() {
        const target = setting.buildPath(setting.target);
        return src([`${dir.src}/*`, `!${dir.src}/index.html`, `!${dir.src}/*.js`])
            .pipe(dest(`${dir.build}/${target}`));
    }

    function fonts() {
        const target = setting.buildPath(setting.target);
        src([`${dir.npm}/md-font/*.{eot,ijmap,svg,ttf,woff,woff2}`])
            .pipe(dest(`${dir.build}/${target}/fonts/material-icon`));
        return src([`${dir.src}/fonts/**/*`])
            .pipe(dest(`${dir.build}/${target}/fonts`));
    }

    function images() {
        const target = setting.buildPath(setting.target);
        let stream = src(`${dir.src}/images/**/*`);
        return stream.pipe(dest(`${dir.build}/${target}/img`));
    }

    function watches() {
        watch([`${dir.src}/*`, `!${dir.src}/*.js`], root);
        watch([`${dir.src}/fonts/**/*`], fonts);
        watch([`${dir.src}/images/**/*`], images);
    }

    function minifyHtml(stream) {
        return stream.pipe(htmlMin({
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            keepClosingSlash: true
        }))
    }

    return {
        tasks: parallel(series(index, root), fonts, images),
        watch: watches,
    };
};