/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
    let modePlugins = [];

    if (options.mode === 'development') {
        modePlugins = [
            new HtmlWebpackPlugin({ template: './public/index.html', filename: 'index.html' })
        ];
    }

    return {
        entry: './src/index.ts',
        mode: 'production',
        target: 'web',
        plugins: [
            new ESLintPlugin({ extensions: ['ts', 'js', 'tsx', 'jsx'] }),
            ...modePlugins
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(scss|css)$/,
                    exclude: /node_modules/,
                    use: [
                        'sass-to-string',
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    outputStyle: 'compressed'
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    exclude: /node_modules/,
                    use: 'svg-url-loader'
                }
            ]
        },
        devServer: {
            port: 3000,
            static: path.join(__dirname, 'dist')
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss']
        },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'lib'),
            libraryTarget: 'umd'
        }
    };
};
