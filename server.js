const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
const port = process.env.PORT || 8000
const mongodoc = require('./api/adaptors/mongodoc/mongodocAdaptor')
const api = require('./api/api')
const errors = require('./api/errors')
const connectionString = process.env.MONGO
const collectionName = process.env.COLLECTION_NAME || 'structure'
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors({
  origin: 'https://s107p01-webapp-admin-01.azurewebsites.net',
  optionsSuccessStatus: 200
}))

const haveConnectionDetails = !!process.env.MONGO
const haveBuildDirectory = fs.existsSync(path.join(__dirname, 'build/index.html'))
const haveUsers = process.env.USERS && process.env.USERS.length >= 16
const haveSecret = process.env.AUTHSECRET && process.env.AUTHSECRET.length >= 16

const exportables = {
  app,
  server: null,
  go: null,
  dataSource: null
}

const go = async () => {
  const noGoErrors = []

  if (!haveConnectionDetails) {
    noGoErrors.push(errors.MONGO_ERROR)
  }

  if (noGoErrors.length) {
    throw(new Error(noGoErrors))
  }

  exportables.dataSource = await mongodoc({ connectionString, collectionName })

  api(app, exportables.dataSource)
  console.log('API STARTED')

  if (haveBuildDirectory) {
    console.log('BUILD DIRECTORY BEING SERVED')
    app.use(serveStatic('build/', { index: ['index.html'] }))
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'))
    })
  } 
}

exportables.go = go()
  .catch(e => {
    errors.log(e.message.split())
  })
  .finally(() => {
    app.get('/api/*', (req, res) => res.status(500).send('Error - check config'))
    exportables.server = app.listen(port, () => {
      console.log('Magic happens on port ' + port)
    })
  })

module.exports = exportables
