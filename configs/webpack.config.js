const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const TerserPlugin = require('terser-webpack-plugin');
const { resolve } = require('path');
const { merge } = require('webpack-merge');
const config = require('./phase.config');
const pkg = require('../package.json');

const PHASE = (process.env.PHASE || 'local').toUpperCase();

const defaultConfig = {
    context: resolve(__dirname, '../src'),
    entry: {
        app: `./js/index.tsx`,
    },
    output: {
        filename: `${pkg.name}.js`,
        path: resolve(__dirname, `../dist/cdn/${pkg.version}`),
        publicPath: PHASE === 'LOCAL' ? '/' : `${config[PHASE].urls.assets}/${pkg.version}/`,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset/resource',
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                loader: 'file-loader',
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { CONFIG: JSON.stringify(config[PHASE]) },
        }),
        new HtmlWebpackPlugin(
            Object.assign({ template: `../src/index.html`, filename: `index.html` }, config[PHASE]),
        ),
        new SpritesmithPlugin({
            src: {
                cwd: 'src/sprite/assets/',
                glob: '*',
            },
            target: {
                image: 'src/sprite/generated/sprite.png',
                css: 'src/sprite/generated/sprite.scss',
            },
            apiOptions: {
                cssImageRef: '../sprite/generated/sprite.png',
            },
            spritesmithOptions: {
                padding: 10,
            },
        }),
    ],
    resolve: {
        alias: {
            _actions: resolve(__dirname, '../src/js/actions'),
            _components: resolve(__dirname, '../src/js/components'),
            _constants: resolve(__dirname, '../src/js/constants'),
            _img: resolve(__dirname, '../src/resource/img'),
            _models: resolve(__dirname, '../src/@types'),
            _reducers: resolve(__dirname, '../src/js/reducers'),
            _utils: resolve(__dirname, '../src/js/utils'),
            _json: resolve(__dirname, '../src/resource/json'),
        },
        extensions: ['.js', '.tsx', '.ts', '.json', 'css'],
    },
};

const devConfig = {
    mode: 'development',
    plugins: [new webpack.HotModuleReplacementPlugin()],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    devtool: 'inline-source-map',
    devServer: {
        allowedHosts: 'all',
        client: {
            webSocketURL: 'ws://0.0.0.0:8080/ws',
        },
        compress: true,
        historyApiFallback: true,
        host: '0.0.0.0',
        port: 8080,
    },
};

const prodConfig = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${pkg.name}.css`,
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {},
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: ['default', { mergeRules: false }],
                },
            }),
        ],
    },
};

module.exports =
    process.env.NODE_ENV === 'production'
        ? merge(defaultConfig, prodConfig)
        : merge(defaultConfig, devConfig);
