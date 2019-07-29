const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/frameworks.json')
const testRecords = {}

const { helpers } = require('./setup')()
let records = null


describe('api:framework:delete', () => {
  before((done) => {
    helpers.removeAllRecords('framework')
    .then(() => helpers.createRecord('framework', testData.loans))
    .then(() => helpers.createRecord('framework', testData.weapons))
    .then(() => helpers.createRecord('framework', testData.builders))
    .then(() => done())
    .catch(err => {
      console.log(err)
      done()
    })
  })

  it('should be able to delete a specific record', done => {   
    const id = helpers.recordCache.loans._id
    server
      .delete(`http://127.0.0.1:5000/api/framework/${id}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
  })

  it('should return 404 if the record does not exist', done => {
    const id = helpers.recordCache.loans._id
    server
      .delete(`http://127.0.0.1:5000/api/framework/${id}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
})