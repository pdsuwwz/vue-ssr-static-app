const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
  mode: isProd ? 'production' : 'development',
  entry: {
    app: ['@babel/polyfill', './src/styles/index.js', './src/entry-client.js'],
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test(module) {
            return (
              /node_modules/.test(module.context) &&
              !/\.css$/.test(module.request)
            )
          }
        }
      }
    },
    minimizer: [new TerserWebpackPlugin({
      sourceMap: false,
      parallel: true,
      terserOptions: {
        keep_fnames: true,
      },
    })],
  },
  plugins: [
    new VueSSRClientPlugin(),
  ]
})
module.exports = config
