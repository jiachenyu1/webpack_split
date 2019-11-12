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
const getView = require('./getView');
// const DemoPlugin = require('./pluginDemo');

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
    stats: 'errors-only',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: './postcss.config.js'
                        },
                        plugins: [
                            require('autoprefixer')({})
                        ]
                    }
                }],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'scss-loader', 'postcss-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'less-loader', 'postcss-loader']
            },
            {
                test: /\.(jpg|png|jpeg)$/,
                use: 'file-loader'
            },
            {
                test: /\.html$/,
                use: ['jcy-loader', 'html-layout-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
        ]
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commonStyle: {
    //                 name: 'common',
    //                 chunks: 'all',
    //                 test: /[\\/]common[\\/]css[\\/]/
    //             },
    //             detailStyle: {
    //                 name: 'detail',
    //                 chunks: 'all',
    //                 enforce: true,
    //                 test: (m, c, entry = 'detail') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry
    //             }
    //         }
    //     }
    // },
    plugins: [
        ...htmlWebpackPluginList,
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')]
        }),
        // new DemoPlugin()
        // new MiniCssExtractPlugin({
        //     filename: '/css/[name].css'
        // })
    ],
    devServer: {
        hot: true,
        hotOnly: true,
        contentBase: path.resolve(__dirname, '../dist'),
        watchContentBase: true
    }
};

// console.log(process.env.NODE_ENV)
module.exports = Object.assign({}, process.env.NODE_ENV === 'production' ? prodConfig : devConfig, config);