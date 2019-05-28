const glob = require('glob');
const path = require("path");
const getView = (globPath) => {
    let files = glob.sync(globPath);
    let entries = {};
    files.forEach(item => {
        const dirname = path.dirname(item);//当前目录
        const split = dirname.split('/');
        const pathMiddleName = split[split.length - 1];
        entries[pathMiddleName] = item;
    });
    return entries;
}

const pages = getView('./pages/**/*.html');
const ls = Object.entries(pages);
console.log(ls)
Object.entries(pages).forEach(item=>{
    const htmlname = item[0];
    const pathname = item[1];
    let conf = {
        filename: `${htmlname}.html`,
        template: `${pathname}`,
        hash: true,
        chunks:[htmlname],
        minify: {
            removeAttributeQuotes:true,
            removeComments: true,
            collapseWhitespace: true,
            removeScriptTypeAttributes:true,
            removeStyleLinkTypeAttributes:true
        }
    }
    console.log(conf);
    // htmlWebpackPluginList.push(new htmlWebpackPlugin(conf))
})