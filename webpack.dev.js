const webpack = require('webpack');

const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const Fibers = require('fibers');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const getPackageNameFromPath = require('./config/getPackageNameFromPath');

// Settings
const cfg = require('./config/config');

module.exports = {
    context: __dirname,
    entry: {
        main: path.resolve(__dirname, cfg.files.ts),
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    output: {
        filename: 'js/[name].js',
        publicPath: '',
        path: path.resolve(__dirname, cfg.paths.public.base),
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'cache-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            transpileOnly: true,
                            experimentalWatchApi: true,
                            configFile: cfg.configs.ts.dev,
                        },
                    },
                ],
                include: path.resolve('src'),
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hot: true,
                        },
                    },
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: ['./node_modules'],
                                implementation: require('sass'),
                                fiber: Fibers,
                                indentedSyntax: true,
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.sass', '.html'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            filename: 'index.html',
            template: cfg.files.template,
            // excludeChunks: ['server'], Dont want to be included in HTML
        }),
        new HtmlWebpackHarddiskPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new WebpackNotifierPlugin({
            excludeWarnings: false,
            sound: true,
            wait: true,
        }),
    ],
    optimization: {
        runtimeChunk: true,
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            maxInitialRequests: Infinity,
            cacheGroups: {
                vendors: {
                    test: /\/node_modules\//,
                    name(module, chunks) {
                        const packageName = getPackageNameFromPath(
                            module.context,
                        ).replace('/', '-');
                        return `${packageName}~${chunks
                            .map(chunk => chunk.name)
                            .join('~')}`;
                    },
                },
            },
        },
    },
};
