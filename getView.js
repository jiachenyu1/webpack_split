const glob = require('glob');
const path = require("path");
const getView = (globPath) => {
    let files = glob.sync(globPath);
    let entries = {};
    files.forEach(item => {
        console.log(item)
        const dirname = path.dirname(item);//当前目录
        const split = dirname.split('/');
        const pathMiddleName = split[split.length - 1];
        entries[pathMiddleName] = path.resolve(__dirname, item);
    });
    return entries;
};

// console.log(Object.values(getView('./pages/**/*.js')))

module.exports = getView;