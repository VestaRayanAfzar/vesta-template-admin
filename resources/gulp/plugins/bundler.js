let gulp = require('gulp');
let util = require('gulp-util');
let fse = require('fs-extra');
let path = require('path');
let mkdirp = require('mkdirp');

const PluginError = util.PluginError;
const PLUGIN_NAME = 'bundler';

module.exports = function (config, entry, destination) {
    // let filePath = `${config.dir.root}/vesta.json`;
    if (!fse.existsSync(entry)) {
        throw new PluginError(PLUGIN_NAME, `Entry file was not found at '${entry}'`);
    }
    let src = [];
    bundle(entry, src);
    writeBundle(src);

    function bundle(file, src) {
        if (!fse.existsSync(file)) return;
        if (src.indexOf(file) >= 0) return;
        src.push(file);
        let code = fse.readFileSync(file, {encoding: 'utf8'});
        let directory = path.dirname(file);
        let regex = /import.+from\s+['|"](.+)['|"]/g;
        let match = null;
        while ((match = regex.exec(code)) !== null) {
            let module = path.normalize(path.join(directory, match[1]));
            let fileName = `${module}.ts`;
            fileName += fse.existsSync(fileName) ? '' : 'x';
            bundle(fileName, src);
        }
        return src;
    }

    function writeBundle(src) {
        src.map(module => {
            let relpath = path.relative(config.dir.src, module);
            let dir = path.dirname(relpath);
            let dest = path.join(destination, dir);
            mkdirp.sync(dest);
            fse.copySync(module, path.join(dest, path.basename(module)));
        })
    }
};

