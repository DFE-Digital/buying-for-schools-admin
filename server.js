const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
const port = process.env.PORT || 8000
const mongodoc = require('./api/adaptors/mongodoc/mongodocAdaptor')
const api = require('./api/api')
const errors = require('./api/errors')

const app = express()
app.use(bodyParser.json())

const haveConnectionDetails = !!process.env.MONGO
const haveBuildDirectory = fs.existsSync(path.join(__dirname, 'build/index.html'))
const haveUsers = process.env.USERS && process.env.USERS.length >= 16
const haveSecret = process.env.AUTHSECRET && process.env.AUTHSECRET.length >= 16


const go = async () => {
  const noGoErrors = []
  if (!haveUsers) {
    noGoErrors.push(errors.USERS_ERROR)
  }

  if (!haveSecret) {
    noGoErrors.push(errors.AUTHSECRET_ERROR)
  }

  if (!haveConnectionDetails) {
    noGoErrors.push(errors.MONGO_ERROR)
  }

  if (noGoErrors.length) {
    throw(new Error(noGoErrors))
  }

  const dataSource = await mongodoc({ connectionString: process.env.MONGO })
  api(app, dataSource)

  if (haveBuildDirectory) {
    app.use(serveStatic('build/', { index: ['index.html'] }))
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build/index.html'))
    })
  } 
}

go()
  .catch(e => {
    errors.log(e.message.split())
  })
  .finally(() => {
    app.get('/api/*', (req, res) => res.status(500).send('Error - check config'))
    const server = app.listen(port, () => {
      console.log('Magic happens on port ' + port)
    })
  })

