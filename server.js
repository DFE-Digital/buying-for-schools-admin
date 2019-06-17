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


// models.question.findOne({options: {"$elemMatch": { next: 'booksmaterials'}}}, (err, result) => {
//   console.log(result)
// })


// questionService.getHierarchy('booksmaterials').then(result => {
//   console.log(result)
// })


// models.question.find({}, (err, results) => {
//   console.log(err)
//   if (err) return handleError(err);
//   console.log('results:', results.length)
// })

// const newquestion = {
//   ref: 'test',
//   title: 'Hello world',
//   options: [{
//     ref: 'a',
//     title: 'Aardvark'
//   }]
// }
// models.question.create(newquestion, function (err, result) {
//   console.log(err)
//   console.log(result)
// })

// models.question.deleteOne({ref: 'test'}, (err) => {
//   console.log(err)
// }) 

// const newframework = {
//     "ref": "library",
//     "title": "Library resources",
//     "supplier": "CPC",
//     "url": "https://www.academies.thecpc.ac.uk/suppliers/categories/framework.php?categoryID=6&frameworkID=177",
//     "cat": "books",
//     "descr": "Includes the provision of books, e-books, journals/ periodicals, e-journals, audio books, audio summary, library discovery and associated services split into 4 lots with 12 suppliers. Curriculum books are also available via this deal.",
//     "expiry": "2019-08-08"
// }
// models.framework.create(newframework, (err, result) => {
//   console.log(err)
//   console.log(result)  
// })


const server = app.listen(port, () => {
  console.log('Magic happens on port ' + port)
})

module.exports = {
  server
}