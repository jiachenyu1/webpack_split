const getView = require('./getView');

module.exports = {
    mode: 'development',
    devtool: "cheap-module-eval-source-map",
    entry: getView('./pages/**/*.js', true),
};