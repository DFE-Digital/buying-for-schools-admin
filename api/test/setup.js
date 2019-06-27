const superagent = require('superagent')
const server = superagent.agent()

const setup = {}

exports = module.exports = () => {
  if (setup.app) {
    return setup
  }

  process.env.BUYINGFORSCHOOLS_MONGO = process.env.BUYINGFORSCHOOLS_MONGO.replace(/\/findaframeworkforyourschool\?/, '/testing?')
  const app = require('../../server')
  const helpers = require('./helpers')(app)
  setup.app = app
  setup.helpers = helpers
  return setup
}

// after(() => {
//   setup.app.server.close()
  
// })