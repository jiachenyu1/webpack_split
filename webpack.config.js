/**
 * Created by jiachneyu on 2018/11/2.
 */
const glob = require('glob');
const path = require("path");
const htmlWebpackPlugin = require('html-webpack-plugin');

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
const htmlWebpackPluginList = [];
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
    htmlWebpackPluginList.push(new htmlWebpackPlugin(conf))
})

module.exports = {
    entry: getView('./pages/**/*.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]/[name].js'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|png|jpeg)$/,
                use: 'file-loader'
            },
            {
                test: /\.html$/,
                use: ['html-layout-loader', 'html-loader']
            }
        ]
    },
    plugins: [
        ...htmlWebpackPluginList
    ],
    devServer: {
        hot: true,
        contentBase: './dist',//服务器监听目录
        open: true //自动打开浏览器 打开url
    },
};