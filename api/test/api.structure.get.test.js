const superagent = require('superagent')
const server = superagent.agent()
const expect = require('chai').expect
const setup = require('./setup')

const structureListResponse = {}

describe('api:structure:get', () => {
  before(done => {
    setup().then(() => done())
  })

  describe('structure list', () => {
    before(done => {
      server
        .get('http://127.0.0.1:5000/api/structure')
        .end((err, res) => {
          structureListResponse.status = res.statusCode 
          structureListResponse.body = res.body
          done()
        })
    })

    it('should be able to get a list of all data structures in the database', () => {
      expect(structureListResponse.status).to.equal(200)
      expect(structureListResponse.body.length).to.equal(1)
    })  

    it('should contain the default data summary', () => {
      const record = structureListResponse.body[0]
      expect(record).to.have.property('status', 'DRAFT')
      expect(record).to.have.property('title', 'Default data')
      expect(record).to.have.property('archived', null)
      expect(record).to.have.property('published', null)
    })
  })

  describe('document detail', () => {
    const documentResponse = {}

    before(done => {
      const id = structureListResponse.body[0]._id
      console.log('id', id)
      server
        .get(`http://127.0.0.1:5000/api/structure/${id}`)
        .end((err, res) => {
          documentResponse.status = res.statusCode 
          documentResponse.body = res.body
          console.log(res.body)
          done()
        })
    })

    it('should contain the basic document structure', () => {
      const record = documentResponse.body
      console.log(record)
      expect(record).to.have.property('_id', structureListResponse.body[0]._id)
      expect(record.framework).to.be.an('array')
      expect(record.question).to.be.an('array')
      expect(record.provider).to.be.an('array')
      expect(record.category).to.be.an('array')
      expect(record.title).to.be.a('string')
      expect(record.createdAt).to.be.a('string')
      expect(record.updatedAt).to.be.a('string')
      expect(record.archived).to.be.null
      expect(record.published).to.be.null
    })
  })
})
