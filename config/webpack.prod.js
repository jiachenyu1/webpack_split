const getView = require('./getView');

module.exports = {
    mode: 'production',
    devtool: "cheap-eval-source-map",
    entry: getView('./pages/**/*.js'),
}