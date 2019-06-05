const path = require('path');
const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin')
const resolve = (dir) => path.join(__dirname, '..', dir)
const getPreLoaderForVueLoader = () => {
    return {
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
    }
}

const getVueLoader = () => {
    return {
        test: /\.vue$/,
        use: {
            loader: "vue-loader",
            options: {
                compilerOptions: {
                    preserveWhitespace: false
                }
            }
        },
        exclude: /node_modules/,
        include: resolve('src')
    }
}

const getJSXLoader = () => {
    return {
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
    }
}

const getCssLoader = () => {
    return [
        {
            test: /\.scss/,
            use: [ExtractCssChunksPlugin.loader, 'css-loader', {
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
            use: [ExtractCssChunksPlugin.loader, "css-loader"],
        }
    ]
}
const getAssetsLoader = () => {
    return [{
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
}
module.exports = [
    // getPreLoaderForVueLoader(),
    getVueLoader(),
    getJSXLoader(),
    ...getCssLoader(),
    ...getAssetsLoader()
]