const mongoose = require('mongoose')
const chai = require('chai')

const testData = require('./testdata/frameworks.json')
const testProviderData = require('./testdata/providers.json')
const testCategoryData = require('./testdata/categories.json')

const expect = chai.expect
const setup = require('./setup')

describe('structureController', () => {
  let structureController = require('../controllers/structure')
  let testProviders = []
  let testCategories = []
  let testFrameworks = []

  before(async () => {
    const setupDone = await setup()
    await setupDone.helpers.removeAllRecords('framework')
    await setupDone.helpers.removeAllRecords('provider')
    testProviders.push(await setupDone.helpers.createRecord('provider', testProviderData.spectre))
    await setupDone.helpers.removeAllRecords('category')
    testCategories.push(await setupDone.helpers.createRecord('category', testCategoryData.construction))
    structureController = structureController(setupDone.dataSource)

    const framework = JSON.parse(JSON.stringify(testData.builders))
    framework.cat = mongoose.Types.ObjectId(testCategories[0].id)
    framework.provider = mongoose.Types.ObjectId(testProviders[0].id)
    testFrameworks.push(await setupDone.helpers.createRecord('framework', framework))
  })

  describe('populateFrameworkReferences', () => {
    it('should return referenced objects and remove ids', done => {
      let result = structureController.populateFrameworkReferences(testFrameworks.map(f => f.toJSON()), testCategories.map(c => c.toJSON()), testProviders.map(p => p.toJSON()))
      expect(result.length).to.equal(1)
      expect(result[0]).to.not.have.property('_id')
      expect(result[0].cat).to.be.an('object')
      expect(result[0].cat).to.not.have.property('_id')
      expect(result[0].provider).to.be.an('object')
      expect(result[0].provider).to.not.have.property('_id')
      done()
    })
  })
})
