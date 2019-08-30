const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/questions.json')
const testRecords = {}

const setup = require('./setup')
let records = null
let authtoken

describe('api:question:get', () => {
  before(async () => {
    const setupDone = await setup()
    await setupDone.helpers.removeAllRecords('question')
    await setupDone.helpers.createRecord('question', testData.bond)
    await setupDone.helpers.createRecord('question', testData.conneryFilms)
    await setupDone.helpers.createRecord('question', testData.world)
    authtoken = await setupDone.getToken()
  })

  it('should be able to get a list of all questions in the database', done => {
    server
      .get('http://127.0.0.1:5000/api/question')
      .set('authorization-token', authtoken)
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
      .set('authorization-token', authtoken)
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
      .set('authorization-token', authtoken)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404)        
        expect(res.body).to.have.property('success', false)
        done()
      })
  })
})