const path = require('path');
const webpack = require('webpack')
const HtmlwebpackPlugin = require('html-webpack-plugin')

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const rules = require('./loaders')
const resolve = (dir) => path.join(__dirname, '..', dir)
const isProd = process.env.NODE_ENV === 'production'

const plugins = [
  new webpack.ProgressPlugin(),
  new webpack.HashedModuleIdsPlugin(),

  new VueLoaderPlugin(),
  new FriendlyErrorsWebpackPlugin({
    clearConsole: true,
    onErrors: (severity, errors) => {
      if (severity !== 'error') {
        return
      }
      const error = errors[0];
      notifier.notify({
        title: 'Webpack error',
        message: `${severity}: ${error.name}`,
        subtitle: error.file || ''
      })
    }
  })
]
if (isProd) {
  plugins.push(
    // TODO: 如果不想使用该插件的话可以在 server.js 中用 html-minifier 代替
    // 参考文章： https://www.cnblogs.com/xiaohuochai/p/9158675.html
    new HtmlwebpackPlugin({
      template: resolve('./templates/index.html'),
      filename: 'index.html',
      minify: {
        removeComments: false,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: false,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: false,
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  )
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  performance: {
    hints: false
  },
  devtool: !isProd ? 'eval-source-map' : false,
  output: {
    path: resolve("dist"),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules
  },
  plugins,
  resolve: {
    // 用于配置可解析的后缀名，其中缺省为 js 和 json
    extensions: ['.js', '.jsx', '.json', '.vue'],
    alias: { // 简化引用的路径名称
      '@': resolve('src'),
      '_c': resolve('src/components'),
      '_assets': path.join(__dirname, '../assets/'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
}