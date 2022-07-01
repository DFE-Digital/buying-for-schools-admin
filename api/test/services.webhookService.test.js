const sinon = require('sinon')

const testData = require('./testdata/frameworks.json')

describe('webhookService', () => {
  let https
  let webhookService
  let testFramework
  let stub
  let env

  before(() => {
    https = require('https')
    stub = sinon.stub(https, 'request').returns({
      on() {},
      write() {},
      end() {}
    })
    webhookService = require('../services/webhookService')
    testFramework = testData.builders
    env = process.env
    process.env = {
      GHBS_WEBHOOK_SECRET: 'secret',
      GHBS_WEBHOOK_ENDPOINT: 'endpoint'
    }
  })

  describe('send', () => {
    it('sends a post request to the webhook endpoint', () => {
      webhookService.send(testFramework)

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': 664,
          'Authorization': 'Bearer secret'
        }
      }

      sinon.assert.calledOnce(https.request)
      sinon.assert.calledWith(stub, 'endpoint', options, sinon.match.any)
    })
  })

  after(() => {
    process.env = env
  })
})
