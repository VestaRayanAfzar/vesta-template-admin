let path = require('path');
let fse = require('fs-extra');

let root = path.normalize(path.join(__dirname, '../..'));

const dir = {
    root: root,
    npm: path.join(root, 'node_modules'),
    resource: path.join(root, 'resources'),
    docker: path.join(root, 'resources/docker'),
    src: path.join(root, 'src'),
    gulp: path.join(root, 'resources/gulp'),
    build: path.join(root, 'vesta'),
};

const targets = {
    web: { build: 'web/www' },
};
targets.web.elimination = include('web');

module.exports = {
    dir,
    targets,
    port: { http: 8090, api: 3000 },
    buildPath: (target) => {
        if (targets[target].build) return targets[target].build;
        process.stderr.write(`Invalid build path for ${target} target`);
        process.exit(1);
    },
    clean: (dir) => {
        try {
            fse.removeSync(dir);
        } catch (e) {
            process.stderr.write(e.message);
        }
    },
    error: (err) => {
        process.stderr.write(err.message);
    },
    is: (target, group) => {
        if (group === 'web') return ['web'].indexOf(target) >= 0;
        if (group === 'electron') return ['electron'].indexOf(target) >= 0;
        if (group === 'cordova') return ['android', 'ios', 'cordova'].indexOf(target) >= 0;
        return false;
    },
    findInFileAndReplace: (file, search, replace, destinationDirectory) => {
        try {
            let content = fse.readFileSync(file, { encoding: 'utf8' });
            content = content.replace(search, replace);
            let fileName = path.parse(file).base;
            let destination = destinationDirectory ? `${destinationDirectory}/${fileName}` : file;
            if (destinationDirectory) {
                fse.mkdirsSync(destinationDirectory);
            }
            fse.writeFileSync(destination, content);
        } catch (e) {
            console.error(`[gulp::config::findInFileAndReplace] ${e.message}`);
        }
    },
    findInStreamAndReplace: (file, search, replace, destinationDirectory) => {

    }
};

function include(...includedTargets) {
    let elimination = [];
    Object.keys(targets).forEach(target => {
        if (includedTargets.indexOf(target) === -1) {
            elimination.push(target);
        }
    });
    return elimination;
}