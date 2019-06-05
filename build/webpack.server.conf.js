const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')
const isProd = process.env.NODE_ENV === 'production'

module.exports = merge(base, {
    mode: isProd ? 'production' : 'development',
    target: 'node',
    devtool: "#source-map",
    entry: './src/entry-server.js',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    externals: nodeExternals({
        // do not externalize CSS files in case we need to import it from a dep
        whitelist: /\.css$/
    }),
    plugins: [
        new VueSSRServerPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        })
    ]
})
