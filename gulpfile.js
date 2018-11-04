const { parallel, series, task } = require("gulp");
const path = require("path");
const config = require("./resources/gulp/config");

const setting = Object.assign({ target: "web", production: false }, config);
const { dir, targets } = setting;

/** foreach target creates new task that changes the setting.target */
Object.keys(targets).forEach(target => {
    targets[target].elimination && task(target, (cb) => {
        setting.target = target;
        cb();
    });
});

createTasks(...loadTasks(["asset", "sass", "polyfill", "client"])); // "model"

function loadTasks(modules) {
    let tasks = [];
    let watches = [];

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

function createTasks(tasks, watches) {
    Object.keys(targets).forEach(target => {
        let targetSpec = targets[target];
        if (targetSpec.elimination) {
            exports[`dev:${target}`] = series(target, runWatches, ...tasks);
            exports[`deploy:${target}`] = series(production, ...tasks);
        }
    });

    function runWatches(cb) {
        for (let i = 0, il = watches.length; i < il; ++i) {
            watches[i]();
        }
        cb();
    }
}

/** sets setting.production to true for deploy tasks */
function production(cb) {
    setting.production = true;
    cb();
}
