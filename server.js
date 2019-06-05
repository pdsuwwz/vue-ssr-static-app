const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { createBundleRenderer } = require("vue-server-renderer");
const isProd = process.env.NODE_ENV === 'production'
const resolve = (file) => path.resolve(__dirname, file);
const config = require('./src/common/config')

function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        basedir: resolve("./dist"),
        runInNewContext: false,
    }));
}

let renderer;
let readyPromise;
const templatePath = resolve("./templates/index.html");

if (isProd) {
    // 生成环境直接使用打包好的资源
    console.log('当前环境：production')
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
        template,
        clientManifest
    })
} else {
    // 开发环境创建一个服务
    console.log('当前环境：development')
    readyPromise = require("./build/setup-dev-server")(
        app,
        templatePath,
        (bundle, options) => {
            renderer = createRenderer(bundle, options);
        },
    );
}


const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app
    .use("/dist", serve("./dist", true))
    .use(express.static('vendor'))

function render(req, res) {
    const s = Date.now()
    res.setHeader("Content-Type", "text/html");

    const handleError = (err) => {
        if (err.url) {
            res.redirect(err.url);
        } else if (err.code === 404) {
            res.status(404).send("404 | Page Not Found");
        } else {
            // Render Error Page or Redirect
            res.status(500).send("500 | Internal Server Error");
            console.error(`error during render : ${req.url}`);
            console.error(err.stack);
        }
    };

    const context = {
        title: "VueSSR Demo",
        url: req.url,
    };
    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err);
        }
        res.send(html);
        if (!isProd) {
            console.log(`whole request: ${Date.now() - s}ms`)
        }
    });
};

app.get('*', isProd ? render : (req, res) => {
    if (!renderer) {
        return res.end('waiting for compilation... refresh in a moment.')
    }
    readyPromise.then(() => render(req, res))
});

const port = config.port;
app.listen(port, () => {
    console.log(`server started at :${port}`);
});