const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./config/webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const app = new express();
const complier = webpack(webpackConfig)
const router = require('./config/route');
const path = require('path');

app.use('/static', express.static('./common'));

app.use(webpackDevMiddleware(complier, {
    noInfo: true,
}));

app.use(webpackHotMiddleware(complier, {
    log: console.log,
    heartbeat: 10 * 1000,
    hot: true
}));

Object.entries(router).forEach(item => {
    // console.log(item)
    let filename = path.join(complier.outputPath, item[1]);
    // console.log(filename)
    // load template from
    app.get(item[0], function (req, res) {
        complier.outputFileSystem.readFile(filename, function (err, result) {
            // console.log(result)
            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        });
    })
})

if (require.main === module) {
    app.listen(3030)
}
