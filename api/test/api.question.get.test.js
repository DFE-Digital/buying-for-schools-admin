const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/questions.json')
const testRecords = {}

let records = null
const { helpers } = require('./setup')()

describe('api:question:get', () => {
  before((done) => {
    helpers.removeAllRecords('question')
    .then(() => helpers.createRecord('question', testData.bond))
    .then(() => helpers.createRecord('question', testData.conneryFilms))
    .then(() => helpers.createRecord('question', testData.world))
    .then(() => done())
  })

  it('should be able to get a list of all questions in the database', done => {
    server
      .get('http://127.0.0.1:5000/api/question')
      .end((err, res) => {
        records = res.body
        expect(res.statusCode).to.equal(200)
        expect(res.body.length).to.equal(3)
        done()
      })
  })

  it('should be able to get a specific question by its id', done => {
    const id = records[1]._id
    server
      .get(`http://127.0.0.1:5000/api/question/${id}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.have.property('_id', id)
        expect(res.body).to.have.property('ref', 'connery-films')
        done()
      })
  })

  it('should return 404 if the document does not exist', done => {
    server
      .get(`http://127.0.0.1:5000/api/question/ffffffffffffffffffffffff`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404)
        expect(res.body).to.have.property('success', false)
        done()
      })
  })

  it('should return 400 if the requested document ID is not valid', done => {
    server
      .get(`http://127.0.0.1:5000/api/question/davidniven`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.have.property('success', false)
        expect(res.body).to.have.property('err', 'invalid-object-id')
        done()
      })
  })
})