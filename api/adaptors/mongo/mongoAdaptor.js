const mongoAdaptorFramework = require('./mongoAdaptorFramework')
const mongoAdaptorQuestion = require('./mongoAdaptorQuestion')
const mongoAdaptorGeneric = require('./mongoAdaptorGeneric')

const mongoAdaptor = options => {
  const models = require('./models/models')(options.connectionString)

  return {
    question: mongoAdaptorQuestion(models),
    framework: mongoAdaptorFramework(models),
    provider: mongoAdaptorGeneric(models, 'provider'),
    category: mongoAdaptorGeneric(models, 'category'),
    models
  }
}

module.exports = mongoAdaptor