const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
const port = process.env.PORT || 5000

const app = express()
app.use(bodyParser.json())

const api = require('./api/api')
const config = {
  dataSource: require('./api/adaptors/mongodoc/mongodocAdaptor')({ connectionString: process.env.MONGO })
}
api(app, config)

if (fs.existsSync(path.join(__dirname, 'build/index.html'))) {
  app.use(serveStatic('build/', { index: ['index.html'] }))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'))
  })
} else {
  app.get('*', (req, res) => res.send('NOT FOUND'))
}

const server = app.listen(port, () => {
  console.log('Magic happens on port ' + port)
})
