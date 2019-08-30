const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/questions.json')
const testRecords = {}

const setup = require('./setup')
let records = null
let authtoken
let helpers

describe('api:question:delete', () => {
  before(async () => {
    const setupDone = await setup()
    helpers = setupDone.helpers
    await helpers.removeAllRecords('question')
    await helpers.createRecord('question', testData.bond)
    await helpers.createRecord('question', testData.conneryFilms)
    await helpers.createRecord('question', testData.world)
    authtoken = await setupDone.getToken()
  })

  it('should be able to delete a specific record', done => {   
    const id = helpers.recordCache.bond._id
    server
      .delete(`http://127.0.0.1:5000/api/question/${id}`)
      .set('authorization-token', authtoken)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
  })

 it('should return 404 if the record does not exist', done => {
    const id = helpers.recordCache.bond._id
    server
      .delete(`http://127.0.0.1:5000/api/question/${id}`)
      .set('authorization-token', authtoken)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
})