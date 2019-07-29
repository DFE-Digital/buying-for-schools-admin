const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const testData = require('./testdata/categories.json')
const testRecords = {}

const { helpers } = require('./setup')()
let records = null


describe('api:category', () => {
  before((done) => {
    helpers.removeAllRecords('category')
    .then(() => helpers.createRecord('category', testData.baddies))
    .then(() => helpers.createRecord('category', testData.vehicles))
    .then(() => helpers.createRecord('category', testData.sidekicks))
    .then(() => done())
  })

  
  describe('get', () => {
    it('should be able to get a list of all categories in the database', done => {
      server
      .get('http://127.0.0.1:5000/api/category')
      .end((err, res) => {
        records = res.body
        expect(res.statusCode).to.equal(200)
        expect(res.body.length).to.equal(3)
        done()
      })
    })

    it('should be able to get a specific category by its id', done => {
      const id = records[1]._id
      server
        .get(`http://127.0.0.1:5000/api/category/${id}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('_id', id)
          expect(res.body).to.have.property('title', 'Bond vehicles, cars, planes, helicopters etc')
          done()
        })
    })

    it('should return 404 if the document does not exist', done => {
      server
        .get(`http://127.0.0.1:5000/api/category/ffffffffffffffffffffffff`)
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
        .post('http://127.0.0.1:5000/api/category')
        .send({
          title: 'Bond Girls'
        })
        .end((err, res) => {
          console.log(res.body)
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('_id')
          done()
        })
    })

    it('cannot have a blank title', done => {
      server
        .post('http://127.0.0.1:5000/api/category')
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

  describe('put', () => {
    it('should be able to update category record', done => {
      const id = records[1]._id
      server
        .put(`http://127.0.0.1:5000/api/category/${id}`)
        .send({
          title: 'Spectre Corp'
        })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body).to.have.property('title', 'Spectre Corp')
          done()
        })
    })

    it('should not update to a blank title', done => {
      const id = records[1]._id
      server
        .put(`http://127.0.0.1:5000/api/category/${id}`)
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
    it('should be able to delete a category', done => {
      const id = records[0]._id
      server
        .delete(`http://127.0.0.1:5000/api/category/${id}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
    
    it('should return 404 if the record no longer exists', done => {
      const id = records[0]._id
      server
        .delete(`http://127.0.0.1:5000/api/category/${id}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404)
          done()
        })
    })
  })
})
