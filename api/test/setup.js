const superagent = require('superagent')
const server = superagent.agent()

const setup = {}

exports = module.exports = () => {
  if (setup.app) {
    return setup
  }

  process.env.S107D01_MONGO_01 = process.env.S107D01_MONGO_01.replace(/\/s107d01-mongo-01\?/, '/testing?')
  const app = require('../../server')
  const helpers = require('./helpers')(app)
  setup.app = app
  setup.helpers = helpers
  return setup
}

