const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const postCss = require("gulp-postcss");
const autoPrefixer = require("autoprefixer");
const csswring = require("csswring");
const mqpacker = require("css-mqpacker");
const eliminator = require("./plugins/eliminator");
const { src, dest, watch } = require("gulp");

module.exports = function(setting) {
    const dir = setting.dir;
    const browsersToSupport = [
        "last 4 version",
        "iOS >= 7",
        "Android >= 4",
        "Explorer >= 10",
        "ExplorerMobile >= 11"
    ];

    function compileSass() {
        const genMap = !setting.production;
        const target = setting.buildPath(setting.target);
        let stream = src(getEntries());
        if (genMap) {
            stream = stream.pipe(sourcemaps.init());
        }
        stream = stream.pipe(eliminator(setting)).pipe(sass());
        const preprocessors = [autoPrefixer({ browsers: browsersToSupport })];
        preprocessors.push(mqpacker);
        preprocessors.push(csswring);
        stream = stream.pipe(postCss(preprocessors));
        if (genMap) {
            stream = stream.pipe(sourcemaps.write());
        }
        return stream.pipe(dest(`${dir.build}/${target}/css`));
    }

    function watches() {
        watch(`${dir.src}/scss/**/*.scss`, compileSass);
    }

    function getEntries() {
        return [
            `${dir.src}/scss/app-init.scss`,
            `${dir.src}/scss/app-rtl.scss`,
            `${dir.src}/scss/app-ltr.scss`,
        ];
    }

    return {
        tasks: compileSass,
        watch: watches
    };
};