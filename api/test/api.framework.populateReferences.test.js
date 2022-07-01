const mongoose = require('mongoose')
const chai = require('chai')

const testData = require('./testdata/frameworks.json')
const testProviderData = require('./testdata/providers.json')
const testCategoryData = require('./testdata/categories.json')

const expect = chai.expect
const setup = require('./setup')

describe('frameworkController', () => {
  let frameworkController = require('../controllers/framework')
  let testProvider
  let testCategory
  let testFramework

  before(async () => {
    const setupDone = await setup()
    await setupDone.helpers.removeAllRecords('framework')
    await setupDone.helpers.removeAllRecords('provider')
    testProvider = await setupDone.helpers.createRecord('provider', testProviderData.spectre)
    await setupDone.helpers.removeAllRecords('category')
    testCategory = await setupDone.helpers.createRecord('category', testCategoryData.construction)
    frameworkController = frameworkController(setupDone.dataSource)

    const framework = JSON.parse(JSON.stringify(testData.builders))
    framework.cat = mongoose.Types.ObjectId(testCategory.id)
    framework.provider = mongoose.Types.ObjectId(testProvider.id)
    testFramework = await setupDone.helpers.createRecord('framework', framework)
  })

  describe('populateReferences', () => {
    it('should return referenced objects and remove ids', async () => {
      let result = await frameworkController.populateReferences(testFramework.toJSON())
      expect(result).to.not.have.property('_id')
      expect(result.cat).to.be.an('object')
      expect(result.cat).to.not.have.property('_id')
      expect(result.provider).to.be.an('object')
      expect(result.provider).to.not.have.property('_id')
    })
  })
})
