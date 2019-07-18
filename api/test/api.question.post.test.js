const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/questions.json')
const testRecords = {}

const { helpers } = require('./setup')()

describe('api:question:post', () => {
  before((done) => {
    helpers.removeAllRecords('question').then(() => done())
  })

  describe('new question', () => {
    it('should create with minimum data', done => {
      server
        .post('http://127.0.0.1:5000/api/question')
        .send({
          ref: 'jbond',
          title: 'James Bond'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('_id')
          done()
        })
    })

    it('must have a unique ref', done => {
      server
        .post('http://127.0.0.1:5000/api/question')
        .send({
          ref: 'jbond',
          title: 'James bond films'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          expect(res.body).to.have.property('err', 'validation')
          expect(res.body).to.have.property('msg', 'Validation errors')
          expect(res.body.errors[0]).to.have.property('id', 'ref')
          done()
        })
    })
    

    it('cannot have a blank title', done => {
      server
        .post('http://127.0.0.1:5000/api/question')
        .send({
          ref: 'jamesbond',
          title: ''
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          expect(res.body).to.have.property('err', 'validation')
          expect(res.body).to.have.property('msg', 'Validation errors')
          expect(res.body.errors[0]).to.have.property('id', 'title')
          done()
        })
    })

    const invalidRefs = ['', 'a bond film', 'm4n-with-golden-gun', '#spyfilms']
    invalidRefs.forEach(ref => {
      it(`should not create anything with an invalid ref: "${ref}"`, done => {
        server
          .post(`http://127.0.0.1:5000/api/question`)
          .send({
            ref,
            title: `title: ${ref}`
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400)
            expect(res.body).to.have.property('err', 'validation')
            expect(res.body).to.have.property('msg', 'Validation errors')
            expect(res.body.errors[0]).to.have.property('id', 'ref')
            done()
          })
      })
    })

    it('should create with full data', done => {
      server
        .post('http://127.0.0.1:5000/api/question')
        .send(testData.world)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('_id')
          expect(res.body).to.have.property('title', testData.world.title)
          expect(res.body).to.have.property('hint', testData.world.hint)
          expect(res.body).to.have.property('err', testData.world.err)
          expect(res.body).to.have.property('suffix', testData.world.suffix)
          expect(res.body).to.have.property('options')
          expect(res.body.options.length).to.equal(3)
          testData.world.options.forEach((opt, i) => {
            const resultOpt = testData.world.options[i]
            expect(resultOpt).to.have.property('ref', opt.ref)
            expect(resultOpt).to.have.property('title', opt.title)
            expect(resultOpt).to.have.property('hint', opt.hint)
            expect(resultOpt).to.have.property('next', opt.next)
            expect(resultOpt).to.have.property('result')
            expect(resultOpt.result).to.be.an('array')
          })
          testRecords.world = res.body
          done()
      })
    })

    it('should handle garbage requests with no data', done => {
      server
        .post('http://127.0.0.1:5000/api/question')
        .send()
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          done()
        })
    })

    it('should handle garbage requests with wrong headers', done => {
      server
        .post('http://127.0.0.1:5000/api/question')
        .set('accept', 'image/png')
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          done()
        })
    })

    describe('new question linked to an existing option', () => {
      it('should be able to create a new question and link it to a previous question', done => {
        const parentId = testRecords.world._id
        const optionId = testRecords.world.options[1]._id

        server
          .post(`http://127.0.0.1:5000/api/question/${parentId}/${optionId}`)
          .send(testData.boatthames)
          .end((err, res) => {
            testRecords.boatthames = res.body
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.have.property('_id')
            expect(res.body).to.have.property('title', testData.boatthames.title)
            done()
          })
      })

      it('should have updated the parent record\'s option to link to the new question', done => {
        server
          .get(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body.options[1].next).to.equal(testRecords.boatthames._id)
            expect(res.body.options[1].result.length).to.equal(0)
            done()
          })  
      })
    })
  })
})