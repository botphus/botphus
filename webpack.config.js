'use strict';
const fs = require('fs-extra');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');

const config = require('./dist/server/modules/config').default;

fs.emptyDirSync(path.join(__dirname, './dist/client/'));

const env = /-p/.test(process.argv[2]) ? 'production' : 'development'; //Set webpack env

module.exports = {
    mode: env,
    entry: './client/assets/app.tsx',
    output: {
        path: path.resolve(__dirname, './dist/client/'),
        filename: 'app.min.js?[chunkhash:8]',
        chunkFilename: 'chunk.[name].min.js?[chunkhash:8]',
        publicPath: '/public/'
    },
    resolve: {
        // Add locale alias
        alias: {
            localeAntd: `antd/lib/locale-provider/${config.locale}`,
            localeSystem: path.resolve(__dirname, `./dist/server/locale/${config.locale}`)
        },
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    externals:{
        user: 'user'
    },
    module: {
        rules: [
            {
                test: /\.(tsx|ts)$/,
                exclude: /(node_modules)/,
                use: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.join(__dirname, './client/tsconfig.json'),
                            getCustomTransformers: () => ({
                                before: [ tsImportPluginFactory({
                                    libraryDirectory: 'es',
                                    libraryName: 'antd',
                                    style: true,
                                })]
                            })
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    publicPath: '../',
                    limit: 10000,
                    name: '[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.(less|css)$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../',
                    }
                }, 'css-loader', {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': `"${env}"`
            }
        }),
        new HtmlWebpackPlugin({
            chunksSortMode: 'none',
            inject: false,
            filename: '../views/index.html',
            template: './client/views/index.html'
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].min.css?[chunkhash:8]',
            chunkFilename: '[id].min.css?[chunkhash:8]'
        })
    ]
};