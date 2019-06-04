const express = require('express')
const server = express()
const fs = require('fs')
const createRenderer = require('vue-server-renderer').createRenderer
const createApp = require('./dist/server-bundle').default

const renderer = createRenderer({
  template: fs.readFileSync('./templates/index.html', 'utf-8'),
})

server
  .use(express.static('dist'))
  .get('*', (req, res) => {
    const context = {
      title: 'hello',
      meta: `
        <meta charset="utf8">
      `,
      url: req.url
    }

    createApp(context)
      .then(app => {
        renderer.renderToString(app, context, (err, html) => {
          if (err) {
            if (err.code === 404) {
              res.status(404).end('404 Page not found')
            } else {
              res.status(500).end('500 Internal Server Error')
            }
            return
          }

          res.send(html)
        })
      })
      .catch(error => {
        res.status(404).end('Error Page not found')
      })
  })
  .listen(8080, () => {
    console.log(`server started at localhost:8080`)
  })
