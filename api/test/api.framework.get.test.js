const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/frameworks.json')
const testRecords = {}

let records = null
const { helpers } = require('./setup')()

describe('api:framework:get', () => {
  before((done) => {
    helpers.removeAllRecords('framework')
    .then(() => helpers.createRecord('framework', testData.loans))
    .then(() => helpers.createRecord('framework', testData.weapons))
    .then(() => helpers.createRecord('framework', testData.builders))
    .then(() => done())
  })

  it('should be able to get a list of all frameworks in the database', done => {
    server
      .get('http://127.0.0.1:5000/api/framework')
      .end((err, res) => {
        records = res.body
        expect(res.statusCode).to.equal(200)
        expect(res.body.length).to.equal(3)
        done()
      })
  })

  it('should be able to get a specific framework by its id', done => {
    const id = records[1]._id
    server
      .get(`http://127.0.0.1:5000/api/framework/${id}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.have.property('_id', id)
        expect(res.body).to.have.property('ref', 'weapons')
        done()
      })
  })

  it('should return 404 if the document does not exist', done => {
    server
      .get(`http://127.0.0.1:5000/api/framework/ffffffffffffffffffffffff`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404)        
        expect(res.body).to.have.property('success', false)
        done()
      })
  })
})