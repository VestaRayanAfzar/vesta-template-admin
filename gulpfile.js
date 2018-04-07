const gulp = require('gulp');
const runSequence = require("run-sequence");
const path = require('path');
const rimraf = require("rimraf");
const config = require('./resources/gulp/config');

let setting = Object.assign({target: 'web', production: false}, config);
let {dir, targets} = setting;
// removing tmp directory at the begining
rimraf.sync(`${dir.build}/tmp`);

/** foreach target creates new task that changes the setting.target */
Object.keys(targets).forEach(target => {
    targets[target].elimination && gulp.task(target, () => {
        setting.target = target;
    });
});

/** sets setting.production to true for deploy tasks */
gulp.task('production', () => {
    setting.production = true;
});

// createTasks(...loadTasks(['server']), true);
createTasks(...loadTasks(['asset', 'sass', 'client', 'model']), false);

function loadTasks(modules) {
    let tasks = [],
        watches = [];

    for (let i = 0, il = modules.length; i < il; ++i) {
        let result = require(path.join(dir.gulp, modules[i]))(setting);
        if (result.tasks) {
            tasks = tasks.concat(result.tasks);
        }
        if (result.watch) {
            watches = watches.concat(result.watch);
        }
    }
    return [tasks, watches];
}

function createTasks(tasks, watches, isServerTasks) {
    if (isServerTasks) {
        gulp.task(`dev:server`, tasks.concat(watches));
        gulp.task(`deploy:server`, ['production'].concat(tasks));
    } else {
        Object.keys(targets).forEach(target => {
            let targetSpec = targets[target];
            if (targetSpec.elimination) {
                // all watches can run in parallel
                const devTasks = [target].concat(tasks.concat([watches]));
                const prodTasks = ["production", target].concat(tasks);
                gulp.task(`dev:${target}`, () => runSequence(...devTasks));
                gulp.task(`deploy:${target}`, () => runSequence(...prodTasks));
            }
        });
    }
}