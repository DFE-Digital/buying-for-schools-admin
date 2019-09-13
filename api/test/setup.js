const express = require('express')
const bodyParser = require('body-parser')
const superagent = require('superagent')
const agent = superagent.agent()
const port = process.env.PORT || 5000
const api = require('../api')
const app = express()
const mongodoc = require('../adaptors/mongodoc/mongodocAdaptor')
app.use(bodyParser.json())

const setup = {}

process.env.USERS = '579b1220a4e48538c1989daf7a514f52'
process.env.AUTHSECRET = '1234567890'
process.env.COLLECTION_NAME = 'MOCHA_' + Date.now()


after(async () => {
  console.log('closing server')
  setup.server.close()
  if (process.env.COLLECTION_NAME !== 'structure') {
    await setup.dataSource.model.collection.drop()
  }
})


exports = module.exports = async () => {
  if (setup.app) {
    return setup
  }

  const dataSource = await mongodoc({ connectionString: process.env.MONGO, collectionName: process.env.COLLECTION_NAME })
  const helpers = require('./helpers.mongodoc')(dataSource)
  api(app, dataSource)

 
  const server = app.listen(port, () => {
    console.log('Magic happens on port ' + port)
  })

  const getToken = async () => {
    const response = await agent.post('http://127.0.0.1:5000/auth').send({
      user: 'user@dfe.gov.uk',
      pass: 'dfe'
    })
    return response.body.token
  }

  setup.app = app
  setup.server = server
  setup.helpers = helpers
  setup.dataSource = dataSource
  setup.getToken = getToken
  return setup
}
