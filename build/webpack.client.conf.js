const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const manifest = require('../vendor/dll/vendor-manifest.json');
const bundleConfig = require("../bundle-config.json")

const HtmlwebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'

const config = merge(base, {
  entry: {
    bundle: ['@babel/polyfill', './src/styles/index.js', './src/entry-client.js'],
  },
  output: {
    filename: 'client-bundle.js'
  },
  mode: isProd ? 'production' : 'development',
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
  ]
})

module.exports = config
