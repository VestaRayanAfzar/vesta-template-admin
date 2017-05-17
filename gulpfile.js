let gulp = require('gulp');
let path = require('path');
let config = require('./resources/gulp/config');

let setting = Object.assign({target: 'web', production: false}, config);
let {dir, targets} = setting;

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

let [tasks, watches] = loadTasks(['asset', 'sass', 'client', 'server']);
createTasks();

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

function createTasks() {
    Object.keys(targets).forEach(target => {
        let targetSpec = targets[target];
        if (targetSpec.elimination) {
            gulp.task(`dev:${target}`, [target].concat(tasks.concat(watches)));
            gulp.task(`deploy:${target}`, ['production', target].concat(tasks));
        }
    });
}