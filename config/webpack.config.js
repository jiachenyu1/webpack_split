/**
 * Created by jiachneyu on 2018/11/2.
 */
const glob = require('glob');
const path = require("path");
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');

const getView = (globPath) => {
    let files = glob.sync(globPath);
    let entries = {};
    files.forEach(item => {
        const dirname = path.dirname(item);//当前目录
        const split = dirname.split('/');
        const pathMiddleName = split[split.length - 1];
        if (pathMiddleName != 'layout') {
            entries[pathMiddleName] = [];
            entries[pathMiddleName].push(item)
            if (item.endsWith('.js')) {
                entries[pathMiddleName].push('webpack-hot-middleware/client?timeout=20000&reload=true')
            }
        }
    });
    return entries;
};

function recursiveIssuer(m) {
    if (m.issuer) {
        return recursiveIssuer(m.issuer);
    } else if (m.name) {
        return m.name;
    } else {
        return false;
    }
}

const pages = getView('./pages/**/*.html');
const htmlWebpackPluginList = [];
Object.entries(pages).forEach(item => {
    const htmlname = item[0];
    const pathname = item[1][0];
    let conf = {
        filename: `${htmlname}.html`,
        template: `${pathname}`,
        hash: true,
        chunks: [htmlname],
        inject: 'body',
        minify: {
            removeAttributeQuotes: true,
            removeComments: true,
            collapseWhitespace: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }
    }
    htmlWebpackPluginList.push(new htmlWebpackPlugin(conf))
})
const config = {
    entry: getView('./pages/**/*.js'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /.scss$/,
                use: ['style-loader', 'scss-loader', 'postcss-loader']
            },
            {
                test: /.less$/,
                use: ['style-loader', 'less-loader', 'postcss-loader']
            },
            {
                test: /\.(jpg|png|jpeg)$/,
                use: 'file-loader'
            },
            {
                test: /\.html$/,
                use: ['jcy-loader', 'html-layout-loader']
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                indexStyle: {
                    name: 'index',
                    chunks: 'all',
                    enforce: true,
                    test: /common/
                },
                detailStyle: {
                    name: 'detail',
                    chunks: 'all',
                    enforce: true,
                    test: (m, c, entry = 'detail') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry
                }
            }
        }
    },
    plugins: [
        ...htmlWebpackPluginList,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    devServer: {
        hot: true,
        hotOnly: true,
        contentBase: path.resolve(__dirname, '../dist'),
        watchContentBase: true
    }
};

module.exports = Object.assign({}, process.env.NODE_ENv === 'production' ? prodConfig : devConfig, config);