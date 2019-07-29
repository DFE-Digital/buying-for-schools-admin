const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/providers.json')
const testRecords = {}

const { helpers } = require('./setup')()
let records = null


describe('api:provider', () => {
  before((done) => {
    helpers.removeAllRecords('provider')
    .then(() => helpers.createRecord('provider', testData.qbranch))
    .then(() => helpers.createRecord('provider', testData.spectre))
    .then(() => helpers.createRecord('provider', testData.commandeered))
    .then(() => done())
  })

  
  describe('get', () => {
    it('should be able to get a list of all providers in the database', done => {
      server
      .get('http://127.0.0.1:5000/api/provider')
      .end((err, res) => {
        records = res.body
        expect(res.statusCode).to.equal(200)
        expect(res.body.length).to.equal(3)
        done()
      })
    })
  })
})
