const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const manifest = require('../vendor/dll/vendor-manifest.json');
const bundleConfig = require("../bundle-config.json")

const HtmlwebpackPlugin = require('html-webpack-plugin');
const resolve = (dir) => path.join(__dirname, '..', dir)

const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
  mode: isProd ? 'production' : 'development',
  target: "web",
  entry: {
    bundle: ['@babel/polyfill', './src/styles/index.js', './src/entry-client.js'],
  },
  output: {
    filename: 'client-bundle.js'
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    new HtmlwebpackPlugin({
      template: path.resolve('./templates/index.html'),
      filename: 'index.html',
      // // 加载dll文件
      vendorJsName: bundleConfig.vendor.js,
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
      inject: true,
    }),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, '..'),
      manifest
    }),
  ],
  devServer: {
    contentBase: [resolve('dist'), resolve('vendor')], // 配置多个数据源
    inline: false, // 取消热更新，并且浏览器控制台不产生构建消息
    host: '127.0.0.1',
    port: 8080,
    disableHostCheck: true,
    quiet: true, // 使用 FriendlyErrorsWebpackPlugin ，可设置此选项来关闭控制台不必要的信息
  },
})

module.exports = config
