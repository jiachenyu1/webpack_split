const glob = require('glob');
const path = require("path");
const getView = (globPath, hot) => {
    let files = glob.sync(globPath);
    let entries = {};
    files.forEach(item => {
        const dirname = path.dirname(item);//当前目录
        const split = dirname.split('/');
        const pathMiddleName = split[split.length - 1];
        if (pathMiddleName != 'layout') {
            entries[pathMiddleName] = [];
            entries[pathMiddleName].push(item)
            if (item.endsWith('.js') && hot) {
                entries[pathMiddleName].push('webpack-hot-middleware/client?timeout=20000&reload=true')
            }
        }
    });
    return entries;
};

// console.log(Object.values(getView('./pages/**/*.js')))

module.exports = getView;