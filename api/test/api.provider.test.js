const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/providers.json')
const testRecords = {}

const setup = require('./setup')
let records = null


describe('api:provider', () => {
  before(async () => {
    const setupDone = await setup()
    await setupDone.helpers.removeAllRecords('provider')
    await setupDone.helpers.createRecord('provider', testData.qbranch)
    await setupDone.helpers.createRecord('provider', testData.spectre)
    await setupDone.helpers.createRecord('provider', testData.commandeered)
  })

  
  describe('get', () => {
    it('should be able to get a list of all providers in the database', done => {
      server
        .get('http://127.0.0.1:5000/api/provider')
        .end((err, res) => {
          records = res.body
          expect(res.statusCode).to.equal(200)
          expect(res.body.length).to.equal(3)
          done()
        })
    })

    it('should be able to get a specific provider by its id', done => {
      const id = records[1]._id
      server
        .get(`http://127.0.0.1:5000/api/provider/${id}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('_id', id)
          expect(res.body).to.have.property('initials', 'baddies')
          expect(res.body).to.have.property('title', 'Spectre\'s evil supplies ltd')
          done()
        })
    })

    it('should return 404 if the document does not exist', done => {
      server
        .get(`http://127.0.0.1:5000/api/provider/ffffffffffffffffffffffff`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404)        
          expect(res.body).to.have.property('success', false)
          done()
        })
    })
  })

  describe('post', () => {  
    it('should create with minimum data', done => {
      server
        .post('http://127.0.0.1:5000/api/provider')
        .send({
          initials: 'eb',
          title: 'Evil Billionaires club'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('_id')
          done()
        })
    })

    it('cannot have a blank title', done => {
      server
        .post('http://127.0.0.1:5000/api/provider')
        .send({
          initials: 'blank',
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
  })

  describe('put', () => {
    it('should be able to update provider record', done => {
      const id = records[1]._id
      server
        .put(`http://127.0.0.1:5000/api/provider/${id}`)
        .send({
          initials: 'spectre',
          title: 'Spectre Corp'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('initials', 'spectre')
          expect(res.body).to.have.property('title', 'Spectre Corp')
          done()
        })
    })

    it('should not update to a blank title', done => {
      const id = records[1]._id
      server
        .put(`http://127.0.0.1:5000/api/provider/${id}`)
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
  })

  describe('delete', () => {
    it('should be able to delete a provider', done => {
      const id = records[0]._id
      server
        .delete(`http://127.0.0.1:5000/api/provider/${id}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
    
    it('should return 404 if the record no longer exists', done => {
      const id = records[0]._id
      server
        .delete(`http://127.0.0.1:5000/api/provider/${id}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404)
          done()
        })
    })
  })
})
