const port = process.env.PORT || 5000

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.BUYINGFORSCHOOLS_MONGO, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const models = require('./api/models/models')(mongoose)

const questionService = require('./api/services/questionService')(models)

const frameworkController = require('./api/controllers/framework')(models)
const questionController = require('./api/controllers/question')(models)
const questionHierarchy = require('./api/controllers/questionHierarchy')(models)

const app = express()
app.use(bodyParser.json())
app.get('/api/framework', frameworkController.list)
app.post('/api/framework', frameworkController.create)
app.get('/api/framework/:frameworkId', frameworkController.get)
app.put('/api/framework/:frameworkId', frameworkController.put)
app.delete('/api/framework/:frameworkId', frameworkController.remove)


app.get('/api/question', questionController.list)
app.post('/api/question', questionController.create)
app.get('/api/question/:questionId', questionController.get)
app.put('/api/question/:questionId', questionController.put)
app.delete('/api/question/:questionId', questionController.remove)

app.get('/api/questionhierarchy/:questionId', questionHierarchy.get)


const server = app.listen(port, () => {
  console.log('Magic happens on port ' + port)
})

module.exports = {
  server
}