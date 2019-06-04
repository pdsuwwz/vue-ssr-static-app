const path = require('path');
const webpack = require('webpack');
const config = require('../src/common/config.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const notifier = require('node-notifier');
const resolve = (dir) => path.join(__dirname, '..', dir)

module.exports = {
  mode: process.env.NODE_ENV,
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)(\?.*)?$/,
        loader: 'eslint-loader',
        include: resolve('src'),
        options: {
          fix: true,
          // cache: resolve('.cache/eslint'),
          failOnError: true, // 生产环境发现代码不合法，则中断编译
          useEslintrc: true,
          configFile: resolve('.eslintrc.js'),
          formatter: require('eslint-friendly-formatter'),
          // baseConfig: {
          //   extends: [resolve('.eslintrc.js')]
          // }
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
        exclude: /node_modules/,
        include: resolve('src')
      },
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // cacheDirectory: resolve('.cache/babel'),
            extends: resolve('babelrc.js')
          }
        },
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      }, {
        test: /\.scss/,
        use: [process.env.NODE_ENV == 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader', {
          loader: 'css-loader',
          options: {
            modules: false,
            camelCase: true,
            importLoaders: 1,
            localIdentName: '[name]_[local]_[hash:base64:5]',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            sourceMap: true,
            config: {
              path: resolve('postcss.config.js'),
            },
          },
        }, "sass-loader"],
        exclude: resolve('node_modules'),
        include: resolve('src')
      }, {
        test: /\.css/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|bmp|gif|webp|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/img/[name].[hash:7].[ext]',
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'assets/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          name: 'assets/fonts/[name].[hash:7].[ext]'
        }
      }]
  },
  plugins: [
    // 部分插件默认已经支持，无需再次配置，详见文档 https://webpack.js.org/migrate/4/#deprecated-removed-plugins
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
      fallback: 'vue-style-loader'
    }),
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