const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
const port = process.env.PORT || 8000

const app = express()
app.use(bodyParser.json())

const haveConnectionDetails = !!process.env.MONGO
const haveBuildDirectory = fs.existsSync(path.join(__dirname, 'build/index.html'))


if (haveConnectionDetails) {
  const api = require('./api/api')
  const config = {
    dataSource: require('./api/adaptors/mongodoc/mongodocAdaptor')({ connectionString: process.env.MONGO })
  }
  api(app, config)
} else {
  app.get('/api/*', (req, res) => res.send({ haveConnectionDetails }))
}

if (haveBuildDirectory) {
  app.use(serveStatic('build/', { index: ['index.html'] }))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'))
  })
} else {
  app.get('*', (req, res) => res.send({ haveConnectionDetails, haveBuildDirectory, port }))
}

const server = app.listen(port, () => {
  console.log('Magic happens on port ' + port)
  console.log({ haveConnectionDetails, haveBuildDirectory, port })
})
