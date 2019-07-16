const mongoose = require('mongoose')

exports = module.exports = (connectionString) => {
  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false)
  mongoose.connect(connectionString, { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))

  return {
    framework: require('./framework.js')(mongoose),
    question: require('./question.js')(mongoose),
    category: require('./category.js')(mongoose),
    provider: require('./provider.js')(mongoose)
  }
}