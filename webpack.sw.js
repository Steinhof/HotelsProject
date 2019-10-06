const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

// Settings
const cfg = require('./config/config');

module.exports = {
    context: __dirname,
    target: 'web',
    entry: {
        sw: path.resolve(__dirname, cfg.files.sw),
    },
    mode: 'production',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, cfg.paths.public.base),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'cache-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                            transpileOnly: true,
                            experimentalFileCaching: true, // Cache results of previous operation
                            configFile: cfg.configs.ts.build,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new WebpackNotifierPlugin({
            excludeWarnings: false,
            sound: true,
            wait: true,
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
            }),
        ],
    },
};
