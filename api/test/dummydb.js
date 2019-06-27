const testDBConnectionString = process.env.BUYINGFORSCHOOLS_MONGO.replace(/\/findaframeworkforyourschool\?/, '/testing?')
console.log(testDBConnectionString)
const models = require('../models/models')(testDBConnectionString)

const clearQuestions = () => {
  return new Promise((resolve, reject) => {
    models.question.deleteMany({}, (err) => {
      console.log('clearQuestions', err)
      if (err) {
        return reject(err)
      }
      return resolve()
    })  
  })
}

const clearFrameworks = () => {
  return new Promise((resolve, reject) => {
    models.framework.deleteMany({}, (err) => {
      console.log('clearFrameworks', err)
      if (err) {
        return reject(err)
      }
      return resolve()
    })  
  })
}

const clearAll = () => {
  return clearQuestions()
    .then(() => clearFrameworks())
}


exports = module.exports = {
  clearQuestions,
  clearFrameworks,
  clearAll,
  models
}