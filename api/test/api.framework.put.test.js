const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/frameworks.json')

const { helpers } = require('./setup')()
const testRecords = {}

describe('api:framework:put', () => {
  before((done) => {
    helpers.removeAllRecords('framework').then(() => {
      return helpers.createRecord('framework', testData.builders)
    }).then(record => {
      testRecords.builders = record
      done()
    })
  })

  describe('update framework', () => {
    it('should be able to update the title', done => {
      server
        .put(`http://127.0.0.1:5000/api/framework/${testRecords.builders._id}`)
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
        .put(`http://127.0.0.1:5000/api/framework/${testRecords.builders._id}`)
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
          .put(`http://127.0.0.1:5000/api/framework/${testRecords.builders._id}`)
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

    it('should handle garbage requests with no data', done => {
      server.put(`http://127.0.0.1:5000/api/framework/${testRecords.builders._id}`)
        .send({garbage: 'dfdsaf dafdsa fdsafdsafdsafds'})
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          done()
        })
    })

    it('should handle garbage requests with wrong headers', done => {
      server.put(`http://127.0.0.1:5000/api/framework/${testRecords.builders._id}`)
        .set('accept', 'image/png')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
  })
})