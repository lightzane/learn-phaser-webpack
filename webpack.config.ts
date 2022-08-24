import path from 'path';
import { Configuration } from 'webpack';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// ! to enable Reload of page when static files are changed
// * provide a static path config for webpack-dev-server! (see package.json)
// webpack-dev-server --static ./src/app,
// * or provide in devServer.static = []

const config: Configuration = {
    entry: ['./src/main.ts', './src/styles.scss'],
    output: {
        filename: '[name]-[contenthash].js',
        path: path.resolve(__dirname, 'docs'),
    },
    // ! REQUIRED if main.ts imports from other files (to prevent MODULE_NOT_FOUND error)
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    // Extracts CSS and Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translate CSS into CommonJS
                    'css-loader',
                    // Compiles Sass into CSS
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        // to output a new index.html with injected dependencies (i.e. <scripts>)
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].css',
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    devServer: {
        port: 3000,
        // ! to enable Reload of page when static files are changed
        static: ['./src'],
    },
};

export default config;