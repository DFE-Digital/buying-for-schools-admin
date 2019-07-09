const port = process.env.PORT || 5000

const express = require('express')
const bodyParser = require('body-parser')

const models = require('./api/models/models')(process.env.BUYINGFORSCHOOLS_MONGO)
const questionService = require('./api/services/questionService')(models)
const frameworkService = require('./api/services/frameworkService')(models)
const frameworkController = require('./api/controllers/framework')(models)
const questionController = require('./api/controllers/question')(models)
const categoryController = require('./api/controllers/genericController')(models.category)
const providerController = require('./api/controllers/genericController')(models.provider)
const questionHierarchy = require('./api/controllers/questionHierarchy')(models)

const app = express()
app.use(bodyParser.json())

// app.get('/api/*', (req, res, next) => {
//   const timer = setTimeout(next, 500)
// })

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

app.get('/api/questionhierarchy/:questionId', questionHierarchy.get)

const server = app.listen(port, () => {
  console.log('Magic happens on port ' + port)
})

module.exports = {
  server,
  models
}