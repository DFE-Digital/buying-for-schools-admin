const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/frameworks.json')
const testProviderData = require('./testdata/providers.json')
const testCategoryData = require('./testdata/categories.json')
const testRecords = {}

const { helpers } = require('./setup')()

describe('api:framework:post', () => {
  let testProvider
  let testCategory

  before((done) => {
    helpers.removeAllRecords('framework')
    .then(() => helpers.removeAllRecords('provider'))
    .then(() => helpers.createRecord('provider', testProviderData.spectre))
    .then(p => testProvider = p)
    .then(() => helpers.removeAllRecords('category'))
    .then(() => helpers.createRecord('category', testCategoryData.construction))
    .then(c => testCategory = c)
    .then(() => done())
  })

  describe('new framework', () => {
    it('should create with minimum data', done => {
      server
        .post('http://127.0.0.1:5000/api/framework')
        .send({
          ref: 'vehicles',
          title: 'Vehicles for Bond to wreck'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('_id')
          done()
        })
    })

    it('should create with full data', done => {
      const testRecord = {...testData.builders}
      testRecord.cat = testCategory._id.toString()
      testRecord.provider = testProvider._id.toString()
      server
        .post('http://127.0.0.1:5000/api/framework')
        .send(testRecord)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('_id')
          for(let p in testRecord) {
            expect(res.body).to.have.property(p, testRecord[p])
          }

          done()
        })
    })

    it('must have a unique ref', done => {
      server
        .post('http://127.0.0.1:5000/api/framework')
        .send({
          ref: 'builders',
          title: 'Builders'
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
        .post('http://127.0.0.1:5000/api/framework')
        .send({
          ref: 'newframework',
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
          .post(`http://127.0.0.1:5000/api/framework`)
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
  })
})