let through = require('through2');
let gulp = require('gulp');
let util = require('gulp-util');
let fs = require('fs');

const PluginError = util.PluginError;
const PLUGIN_NAME = 'eliminator';

module.exports = function (config, target) {
    target = target || 'client';
    let filePath = `${config.dir.root}/vesta.json`;
    if (!fs.existsSync(filePath)) {
        throw new PluginError(PLUGIN_NAME, `Config file was not found at '${root}/vesta.json'`);
    }

    return through.obj(function (file, encoding, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, 'Streams are not supported');
        }
        if (file.isBuffer()) {
            return buildFor(file, target, cb);
        }
        cb(null, file);
    });

    function buildFor(file, target, cb) {
        let code = file.contents.toString();
        if (config.is(target, 'cordova')) code = eliminateBetween(code, '//<!cordova>', '//</cordova>');
        code = eliminateBetween(code, `//<!${target}>`, `//</${target}>`);
        let eliminations = config.targets[target].elimination;
        eliminations && eliminations.forEach(target => {
            code = eliminateBetween(code, `//<${target}>`, `//</${target}>`);
        });
        file.contents = Buffer.from(code);
        cb(null, file);
    }

    function eliminateBetween(code, startCode, endCode) {
        let startIndex = -1;
        do {
            startIndex = code.indexOf(startCode);
            if (startIndex >= 0) {
                let endIndex = code.indexOf(endCode, startIndex + startCode.length) + endCode.length;
                code = code.substring(0, startIndex) + code.substring(endIndex);
            }
        } while (startIndex >= 0);
        return code;
    }
};
