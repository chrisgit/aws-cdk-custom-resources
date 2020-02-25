const path = require('path')

module.exports = function (_) {
    return {
        entry: {
            index: './lambda/index.js'
        },
        output: {
            path: path.resolve(__dirname, './dist/lambda'),
            libraryTarget: 'commonjs2',
            filename: '[name].js'
        },
        stats: 'minimal',
        target: 'node',
        devtool: 'sourcemap',
        externals: {
            'aws-sdk': 'aws-sdk'
        },
        module: {
            rules: [
                { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
            ]
        },
        mode: 'none'
    }
}
