const path = require('path');
const webpack = require('webpack')
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const rules = require('./loaders')
const resolve = (dir) => path.join(__dirname, '..', dir)

module.exports = {
  mode: 'production',
  performance: {
    hints: false
  },
  output: {
    path: resolve("dist"),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new ExtractCssChunksPlugin({
        filename: "[name].[chunkhash].css",
        chunkFilename: "[name].css",
        orderWarning: true,
    }),
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin({
      clearConsole: true,
      onErrors: (severity, errors) => {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        notifier.notify({
          title: 'Webpack error',
          message: `${severity}: ${error.name}`,
          subtitle: error.file || '',
        });
      },
    }),
  ],
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