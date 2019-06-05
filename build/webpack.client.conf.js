const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const config = merge(base, {
  mode: 'production',
  entry: {
    app: ['@babel/polyfill', './src/styles/index.js'],
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
    }
  },
  plugins: [
    new VueSSRClientPlugin()
  ]
})
module.exports = config
