const { parse } = require('path');
const through = require('through2');
const { PluginError } = require('gulp-util');

const PLUGIN_NAME = 'eliminator';

module.exports = function(config) {
    if (!config || !config.target) throw new PluginError(PLUGIN_NAME, `Invalid config`);
    const isCordova = config.is(config.target, "cordova");
    let eliminationsArea = updateEliminationsArea(config.target);

    return through.obj(function(file, encoding, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }
        if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, 'Streams are not supported');
        }
        if (file.isBuffer()) {
            return buildFor(file, cb);
        }
        cb(null, file);
    });

    function buildFor(file, cb) {
        let eliminations = getEliminationsArea(file);
        let code = file.contents.toString();
        try {
            eliminations.forEach(elimination => {
                code = eliminateBetween(code, elimination.start, elimination.end);
            });
        } catch (e) {
            // adding file path to error
            e.message = e.message.replace('__FILE__', file.path);
            throw e;
        }
        file.contents = Buffer.from(code);
        // console.log(file.path);
        cb(null, file);
    }

    function eliminateBetween(code, startCode, endCode) {
        let startIndex = -1;
        do {
            startIndex = code.indexOf(startCode);
            if (startIndex >= 0) {
                let endIndex = code.indexOf(endCode, startIndex + startCode.length) + endCode.length;
                try {
                    code = code.substring(0, startIndex) + code.substring(endIndex);
                } catch (e) {
                    throw new PluginError(PLUGIN_NAME, ` (${endCode}) was not found for (${startCode}) __FILE__\\n\\t${e}`);
                }
            }
        } while (startIndex >= 0);
        return code;
    }

    function getEliminationsArea(file) {
        const isHtml = parse(file.path).ext.toLowerCase() === '.html';
        return isHtml ? eliminationsArea.html : eliminationsArea.others;
    }

    function updateEliminationsArea(target) {
        const eliminationsArea = { html: [], others: [] };
        // removing production/development
        const envEliminationTag = config.production ? 'development' : 'production';
        if (isCordova) {
            eliminationsArea.others.push({
                start: `/// <!cordova>`,
                end: `/// </cordova>`
            })
        }
        eliminationsArea.html.push({
            start: `<!--${envEliminationTag}-->`,
            end: `<!--/${envEliminationTag}-->`
        });
        eliminationsArea.others.push({
            start: `/// <${envEliminationTag}>`,
            end: `/// </${envEliminationTag}>`
        });
        // removing non relevant target tags
        eliminationsArea.html.push({
            start: `<!--!${target}-->`,
            end: `<!--/${target}-->`
        });
        eliminationsArea.others.push({
            start: `/// <!${target}>`,
            end: `/// </${target}>`
        });

        let eliminations = config.targets[target].elimination;
        eliminations && eliminations.forEach(elimination => {
            eliminationsArea.html.push({
                start: `<!--${elimination}-->`,
                end: `<!--/${elimination}-->`
            });
            eliminationsArea.others.push({
                start: `/// <${elimination}>`,
                end: `/// </${elimination}>`
            });
        });
        return eliminationsArea;
    }
};