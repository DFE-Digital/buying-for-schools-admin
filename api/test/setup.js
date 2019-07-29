const superagent = require('superagent')
const server = superagent.agent()
const port = process.env.PORT || 5000
const api = require('../api')

const setup = {}

exports = module.exports = () => {
  if (setup.app) {
    return setup
  }

  let dataSource
  let helpers
  const source = 'mongodoc'

  switch (source) {
    case 'mongo': {
      const connectionString = process.env.S107D01_MONGO_01.replace(/\/s107d01-mongo-01\?/, '/testing?')
      dataSource = require('../adaptors/mongo/mongoAdaptor')({ connectionString })
      helpers = require('./helpers')(dataSource)
      break
    }

    case 'mongodoc': {
      const connectionString = process.env.S107D01_MONGO_01.replace(/\/s107d01-mongo-01\?/, '/testing?')
      dataSource = require('../adaptors/mongodoc/mongodocAdaptor')({ connectionString })
      helpers = require('./helpers.mongodoc')(dataSource)
      break
    }

    case 'lowdb': {
      dataSource = require('../adaptors/lowdb/lowdbAdaptor')({ path: './_data-test.json' })    
      helpers = require('./helpers.lowdb')(dataSource)
      break
    }
  }

 
  const app = api({ dataSource })
  const server = app.listen(port, () => {
    console.log('Magic happens on port ' + port)
  })
 

  setup.app = app
  setup.server = server
  setup.helpers = helpers
  setup.dataSource = dataSource
  return setup
}