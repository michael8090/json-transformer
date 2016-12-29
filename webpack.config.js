const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsWebpackPlugin = require('assets-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const WebpackMd5Hash = require('webpack-md5-hash');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const WEBPACK_DEV_FILES = [
    'webpack-hot-middleware/client',
];

const WEB_ROOT = __dirname;
const DEST_DIR = path.resolve(WEB_ROOT, './build');
const BUNDLE_MAP_FILE = path.resolve(WEB_ROOT, './build/bundleMap.json');

const webpackEntries = [
    './src/client/index.ts',
];

const webpackConfig = {
    context: WEB_ROOT,
    entry: isDev ? webpackEntries.concat(WEBPACK_DEV_FILES) : webpackEntries,
    debug: isDev,
    devtool: isDev ? 'inline-source-map' : '',
    watch: isDev,
    output: {
        path: path.resolve(WEB_ROOT, DEST_DIR),
        filename: '[name].js',
        publicPath: '/assets/',
    },
    module: {
        loaders: [{
            test: /\.scss$/,
            loader: isDev ? 'style-loader!css-loader!postcss-loader!sass-loader' : ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass-loader'),
        }, {
            test: /\.(gif|jpg|jpeg|png|woff|woff2|eot|ttf|svg)(\?v=.+)?$/,
            loader: 'url-loader?limit=10240&name=[path][name].[ext]?[sha256:hash:base64:8]',
        }, {
            test: /\.tsx?$/,
            loader: 'babel-loader!ts-loader',
        }],
    },
    postcss: [autoprefixer],
    plugins: (!isDev ? [new ExtractTextPlugin('[name].[contenthash].css', { allChunks: false })] : []).concat(
        [
            new WebpackMd5Hash(),
            new AssetsWebpackPlugin({
                path: path.dirname(BUNDLE_MAP_FILE),
                filename: path.basename(BUNDLE_MAP_FILE),
            })
        ]
    ).concat(isDev ? [
        new WebpackNotifierPlugin({ title: 'Webpack(typescript starter)' }),
        new webpack.HotModuleReplacementPlugin(),
    ] : [
        new webpack.optimize.OccurenceOrderPlugin(),

        /* eslint-disable camelcase */
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
            },
        }),
    ]),
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    // for our own use
    bundleMapFile: BUNDLE_MAP_FILE,
};

module.exports = webpackConfig;
