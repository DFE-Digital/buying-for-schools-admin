const mongodocAdaptorGeneric = require('./mongodocAdaptorGeneric')
const mongodocAdaptorManagement = require('./mongodocAdaptorManagement')
const modelTemplate = require('./model')

const mongodocAdaptor = async options => {
  const model = await modelTemplate(options)    
  const generic = mongodocAdaptorGeneric(model)
  const management = mongodocAdaptorManagement(model)
  return {
    model,
    ...generic,
    ...management
  }
}

module.exports = mongodocAdaptor