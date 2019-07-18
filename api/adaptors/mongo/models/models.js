const mongoose = require('mongoose')

exports = module.exports = (connectionString) => {
  mongoose.set('useCreateIndex', true)
  mongoose.set('useFindAndModify', false)
  mongoose.connect(connectionString, { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))

  

  const list = (model, criteria = {}, populate = null) => {
    return new Promise((resolve, reject) => {
      let query = model.find(criteria)
      if (populate) {
        query = populate(query)//query.populate('provider').populate('cat')
      }
      
      query.exec((err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      })
    })
  }

  const get = (model, id, populate = null) => {
    return new Promise((resolve, reject) => {
      let query = model.findOne({ _id: id })
      if (populate) {
        query = populate(query)//query.populate('provider').populate('cat')
      }
      
      query.exec((err, results) => {
        if (err) {
          return reject(err)
        }
        if (!results) {
          return reject({ code: 404 })
        }
        return resolve(results)
      })
    })
  }

  const save = (doc) => {
    return new Promise((resolve, reject) => {
      doc.save((err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)  
      })
    })
  }

  const put = get => (id, data) => {
    return get(id)
    .then(doc => {
      Object.keys(data).forEach(k => {
        doc[k] = data[k]
      })
      return save(doc)
    })
  }

  const create = (model, data) => {
    return new Promise((resolve, reject) => {
      model.create(data, (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      })
    })
  }

  const remove = (model, id) => {
    return new Promise((resolve, reject) => {
      model.deleteOne({ _id: id }, (err, results) => {
        if (err) {
          return reject(err)
        }
        if (results.deletedCount === 0) {
          return reject({ code: 404 })
        }
        return resolve(results)
      })
    })
  }
  

  return {
    framework: require('./framework.js')(mongoose),
    question: require('./question.js')(mongoose),
    category: require('./category.js')(mongoose),
    provider: require('./provider.js')(mongoose),
    list,
    get,
    save,
    put,
    create,
    remove
  }
}