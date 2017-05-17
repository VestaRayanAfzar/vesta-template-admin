let path = require('path');
let fse = require('fs-extra');

let root = path.normalize(path.join(__dirname, '../..'));

const dir = {
    root: root,
    npm: path.join(root, 'node_modules'),
    resource: path.join(root, 'resources'),
    docker: path.join(root, 'resources/docker'),
    src: path.join(root, 'src'),
    srcClient: path.join(root, 'src/client'),
    srcServer: path.join(root, 'src/server'),
    gulp: path.join(root, 'resources/gulp'),
    build: path.join(root, 'vesta'),
    buildClient: path.join(root, 'vesta/client'),
    buildServer: path.join(root, 'vesta/server')
};
const debug = {type: 'debug', ports: {debug: 5857, inspect: 9228}, address: '0.0.0.0'};
const port = {http: 8088, api: 3000};

const targets = {
    web: {build: 'web/www'},
    electron: {build: 'electron/www'},
    cordova: {build: 'cordova/www'},
    android: {build: 'cordova/www'},
    ios: {build: 'cordova/www'}
};
targets.web.elimination = include('web');
targets.electron.elimination = include('electron');
targets.android.elimination = include('cordova', 'android');
targets.ios.elimination = include('cordova', 'ios');

module.exports = {
    dir, port, targets, debug,
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
    findInFileAndReplace: (file, search, replace) => {
        try {
            if (!fse.existsSync(file)) return;
            let content = fse.readFileSync(file, {encoding: 'utf8'});
            content = content.replace(search, replace);
            fse.writeFileSync(file, content);
        } catch (e) {
            console.error(e.message);
        }
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