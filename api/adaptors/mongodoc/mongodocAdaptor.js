const mongodocAdaptorGeneric = require('./mongodocAdaptorGeneric')
const mongodocAdaptorManagement = require('./mongodocAdaptorManagement')

const mongodocAdaptor = options => {
  const model = require('./model')(options.connectionString)
  const generic = mongodocAdaptorGeneric(model)
  const management = mongodocAdaptorManagement(model)
  return {
    model,
    ...generic,
    ...management
  }
}

module.exports = mongodocAdaptor