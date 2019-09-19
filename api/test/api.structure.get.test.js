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
})
