const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/questions.json')

const { helpers } = require('./setup')()
const testRecords = {}

describe('api:question:put', () => {
  before((done) => {
    helpers.removeAllRecords('question').then(() => {
      return helpers.createRecord('question', testData.world)
    }).then(record => {
      testRecords.world = record
      done()
    })
  })

  describe('new question', () => {
    it('should be able to update the title', done => {
      server
        .put(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
        .send({
          title: 'A James Bond film'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('title', 'A James Bond film')
          done()
        })
    })

    it('should not update to a blank title', done => {
      server
        .put(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
        .send({
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
      it(`should not update to an invalid ref: "${ref}"`, done => {
        server
          .put(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
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

    
    invalidRefs.forEach(ref => {
      it(`should not update to an invalid option ref: "${ref}"`, done => {
        const testOptions = [...testData.world.options]
        testOptions[0] = {...testOptions[0], ref}
        server
          .put(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
          .send({ options: testOptions })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400)
            expect(res.body).to.have.property('err', 'validation')
            expect(res.body).to.have.property('msg', 'Validation errors')
            expect(res.body.errors[0]).to.have.property('id', 'options.0.ref')
            done()
          })
      })
    })

    it('should not update to a blank option title', done => {
      const testOptions = [...testData.world.options]
      testOptions[1] = {...testOptions[1], title: ''}
      server
        .put(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
        .send({ options: testOptions })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          expect(res.body).to.have.property('err', 'validation')
          expect(res.body).to.have.property('msg', 'Validation errors')
          expect(res.body.errors[0]).to.have.property('id', 'options.1.title')
          done()
        })
    })

    it('should handle garbage requests with no data', done => {
      server.put(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
        .send({garbage: 'dfdsaf dafdsa fdsafdsafdsafds'})
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          done()
        })
    })

    it('should handle garbage requests with wrong headers', done => {
      server.put(`http://127.0.0.1:5000/api/question/${testRecords.world._id}`)
        .set('accept', 'image/png')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
  })
})