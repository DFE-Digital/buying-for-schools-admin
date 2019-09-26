const api = (app, dataSource) => {
  const frameworkController = require('./controllers/framework')(dataSource)
  const questionController = require('./controllers/question')(dataSource)
  const categoryController = require('./controllers/genericController')(dataSource, 'category')
  const providerController = require('./controllers/genericController')(dataSource, 'provider')
  const structureController = require('./controllers/structure')(dataSource, 'structure')

  app.get('/api/framework', frameworkController.list)
  app.post('/api/framework', frameworkController.create)
  app.get('/api/framework/:frameworkId', frameworkController.get)
  app.put('/api/framework/:frameworkId', frameworkController.put)
  app.delete('/api/framework/:frameworkId', frameworkController.remove)

  app.get('/api/question', questionController.list)
  app.post('/api/question', questionController.create)
  app.post('/api/question/:questionId/:optionId', questionController.create)
  app.get('/api/question/:questionId', questionController.get)
  app.put('/api/question/:questionId', questionController.put)
  app.delete('/api/question/:questionId', questionController.remove)

  app.get('/api/category', categoryController.list)
  app.post('/api/category', categoryController.create)
  app.get('/api/category/:categoryId', categoryController.get)
  app.put('/api/category/:categoryId', categoryController.put)
  app.delete('/api/category/:categoryId', categoryController.remove)

  app.get('/api/provider', providerController.list)
  app.post('/api/provider', providerController.create)
  app.get('/api/provider/:providerId', providerController.get)
  app.put('/api/provider/:providerId', providerController.put)
  app.delete('/api/provider/:providerId', providerController.remove)

  app.get('/api/structure', structureController.list)
  app.get('/api/structure/:structureId', structureController.get)
  app.post('/api/structure', structureController.post)
  app.put('/api/structure/:structureId', structureController.put)
  app.delete('/api/structure/:structureId', structureController.remove)

  return app
}
module.exports = api
