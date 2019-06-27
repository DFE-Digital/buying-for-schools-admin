const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/questions.json')

process.env.BUYINGFORSCHOOLS_MONGO = process.env.BUYINGFORSCHOOLS_MONGO.replace(/\/findaframeworkforyourschool\?/, '/testing?')

const app = require('../../server')
const testRecords = {}

describe('api', () => {
  before((done) => {
    app.models.question.deleteMany({}, (err) => {
      app.models.question.create(testData.world, (err, results) => {
        testRecords.world = results
        done()
      })  
    })  
  })

  describe('new question', () => {
    it('should create with minimum data', done => {
      console.log(testRecords.world._id)
      server
        .put(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
        .send({
          title: 'A James Bond film'
        })
        .end((err, res) => {
          console.log(err.response.body)
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('title', 'A James Bond film')
          done()
        })
    })
  })
})