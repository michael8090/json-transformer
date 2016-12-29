const express = require('express');
const path = require('path');
const fs = require('fs');

const webpackConfig = require('../../webpack.config');

const PORT = process.env.PORT || 7000;
const isDev = process.env.NODE_ENV !== 'production';
const PUBLIC_PATH = webpackConfig.output.publicPath;

const htmlTpl = fs.readFileSync(path.resolve(__dirname, './index.html')).toString();

let styleFileName = PUBLIC_PATH + 'main.css';
let scriptFileName = PUBLIC_PATH + 'main.js';
if (!isDev) {
    const bundleMap = require(webpackConfig.bundleMapFile);
    styleFileName = bundleMap.main.css;
    scriptFileName = bundleMap.main.js;
}
const html = htmlTpl.replace('{STYLE_URL}', styleFileName).replace('{SCRIPT_URL}', scriptFileName);

const app = express();

if (isDev) {
    const webpack = require('webpack');
    const compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {noInfo: true}));
    app.use(require('webpack-hot-middleware')(compiler));
}

app.use(PUBLIC_PATH, express.static(webpackConfig.output.path));

app.get('/', function (req, res) {
    res.status(200).send(html);
});

app.listen(PORT, function () {
    console.log('server is started on port ' + PORT);
});
