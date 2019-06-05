const webpack = require("webpack")
const path = require("path")
const fs = require("fs")
const MFS = require("memory-fs")
const chokidar = require("chokidar")
const serverConfig = require("./webpack.server.conf")
const clientConfig = require("./webpack.client.conf")
const middleware = require('webpack-dev-middleware')

const readFile = (mfs, file) => {
    try {
        return mfs.readFileSync(path.join(clientConfig.output.path, file), "utf-8")
    } catch (e) {
        console.log(e)
    }
}

module.exports = function setupDevServer(app, templatePath, cb) {
    let bundle
    let template
    let clientManifest

    let ready
    const readyPromise = new Promise((r) => {
        ready = r
    })
    const update = () => {
        if (bundle && clientManifest) {
            ready()
            cb(bundle, {
                runInNewContext: false,
                template,
                clientManifest,
            })
        }
    }

    // 监听模版文件
    template = fs.readFileSync(templatePath, "utf-8")
    chokidar.watch(templatePath).on("change", () => {
        template = fs.readFileSync(templatePath, "utf-8")
        console.log("index.html template updated.")
        update()
    })

    // 添加热更新的入口
    clientConfig.entry.app = ["webpack-hot-middleware/client", ...clientConfig.entry.app]
    clientConfig.output.filename = "[name].js"
    clientConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )

    // 创建dev服务
    const clientCompiler = webpack(clientConfig)
    const devMiddleware = middleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        noInfo: true
    })
    app.use(devMiddleware)
    clientCompiler.plugin("done", (stats) => {
        stats = stats.toJson()
        stats.errors.forEach((err) => console.error(err))
        stats.warnings.forEach((err) => console.warn(err))
        if (stats.errors.length) {
            return
        }
        clientManifest = JSON.parse(readFile(
            devMiddleware.fileSystem,
            "vue-ssr-client-manifest.json",
        ))
        update()
    })

    // 开启热更新
    app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))


    // 监听并且更新server入口文件
    const serverCompiler = webpack(serverConfig)
    const mfs = new MFS()
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
        if (err) {
            throw err
        }
        stats = stats.toJson()
        if (stats.errors.length) {
            return
        }

        // 获取内存中的server-bundle
        bundle = JSON.parse(readFile(mfs, "vue-ssr-server-bundle.json"))
        update()
    })
    return readyPromise
}