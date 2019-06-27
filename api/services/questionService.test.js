/* global describe it  */

const expect = require('chai').expect
const models = require('../test/setup')
const questionService = require('./questionService')

describe('questionService', () => {
  // before(() => {
  //   return dummydb.clearQuestions()
  // })  
  
  it('should be a function', () => {
    expect(questionService).to.be.a('Function')  
  })

  describe('questionService when called with models', () => {
    let questionServiceWithModels = null
    
    before(() => {
      questionServiceWithModels = questionService(models)
    })
    
    it('should return an object when called with models', () => {
      expect(questionServiceWithModels).to.be.an('object')
    })

    const funcList = ['get', 'getByRef', 'getByOptionWithNext', 'getHierarchy', 'findOneAndUpdate', 'create']
    funcList.forEach(f => {
      it(`should have property method ${f}`, () => {
        expect(questionServiceWithModels).to.have.property(f)
        expect(questionServiceWithModels[f]).to.be.a('function')
      })
    })
  })
  
  // funcList.forEach(f => {
  //   it(`should export ${f}`, () => {
  //     expect(questionService).toHaveProperty(f)
  //   })  
  // })
})