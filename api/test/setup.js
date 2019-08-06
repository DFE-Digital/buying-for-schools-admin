const express = require('express')
const bodyParser = require('body-parser')
const superagent = require('superagent')
const server = superagent.agent()
const port = process.env.PORT || 5000
const api = require('../api')
const app = express()
app.use(bodyParser.json())

const setup = {}

exports = module.exports = () => {
  if (setup.app) {
    return setup
  }

  const connectionString = process.env.MONGO_TEST
  const dataSource = require('../adaptors/mongodoc/mongodocAdaptor')({ connectionString })
  const helpers = require('./helpers.mongodoc')(dataSource)
 
  api(app, { dataSource })
  const server = app.listen(port, () => {
    console.log('Magic happens on port ' + port)
  })

  setup.app = app
  setup.server = server
  setup.helpers = helpers
  setup.dataSource = dataSource
  return setup
}