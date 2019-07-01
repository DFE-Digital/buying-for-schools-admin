const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/questions.json')
const testRecords = {}

const { helpers } = require('./setup')()
let records = null


describe('api:question:delete', () => {
  before((done) => {
    helpers.removeAllRecords('question')
    .then(() => helpers.createRecord('question', testData.bond))
    .then(() => helpers.createRecord('question', testData.conneryFilms))
    .then(() => helpers.createRecord('question', testData.world))
    .then(() => done())
  })

  it('should be able to delete a specific record', done => {
    const id = helpers.recordCache.bond._id

    server
      .delete(`http://127.0.0.1:5000/api/question/${id}`)
      .end((err, res) => {
        console.log(res.body)
        expect(res.statusCode).to.equal(200)
        done()
      })
  })

 it('should return 404 if the record does not exist', done => {
    const id = helpers.recordCache.bond._id

    server
      .delete(`http://127.0.0.1:5000/api/question/${id}`)
      .end((err, res) => {
        console.log(res.body)
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
})