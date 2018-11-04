const webpack = require("webpack");
const { getWebpackConfig } = require("./config");

module.exports = function(setting) {
    const dir = setting.dir;

    function compile() {
        const wpConfig = getWebpackConfig(setting);
        wpConfig.entry = { polyfill: `${dir.src}/app/polyfill.ts` };
        const compiler = webpack(wpConfig);
        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) {
                    console.error(err);
                    return reject(false);
                }
                const info = stats.toJson();
                if (stats.hasErrors()) {
                    process.stderr.write(info.errors.join("\n\n"));
                }
                resolve(true);
            });
        });
    }

    return {
        watch: [],
        tasks: compile
    };
};