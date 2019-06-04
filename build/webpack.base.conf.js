const path = require('path');
const webpack = require('webpack');
const config = require('../src/common/config.js');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractCssChunksPlugin = require("extract-css-chunks-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const notifier = require('node-notifier');
const rules = require('./loaders')
const resolve = (dir) => path.join(__dirname, '..', dir)


const isClient = process.env.env === 'client'

const plugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
  new VueLoaderPlugin(),
  new FriendlyErrorsWebpackPlugin({
    clearConsole: false,
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
]

if (isClient) {
  plugins.push(
    new ExtractCssChunksPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
      fallBack: 'vue-style-loader'
    }),
  )
}

module.exports = {
  mode: process.env.NODE_ENV,
  performance: {
    hints: false
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