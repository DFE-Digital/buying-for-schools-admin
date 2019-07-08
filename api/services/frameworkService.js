const shared = require('./shared')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

let _models = null

const frameworkService = (models = null) => {
  if (models) {
    _models = models
  }

  const clean = data => {
    delete(data.__v)
    delete(data._id)
    // data.cat = ObjectId(data.cat) || null
    return data
  }

  const get = (criteria) => {
    return new Promise((resolve, reject) => {
      _models.framework.findOne(criteria, (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      })  
    })
  }

  const findUpdateAndSave = (criteria, data) => {
    const cleanData = clean(data)
    console.log(criteria)
    console.log(cleanData)
    return get(criteria).then(doc => {
      console.log('findUpdateAndSave', doc)
      Object.keys(cleanData).forEach(k => {
        doc[k] = cleanData[k]
      })
      return shared.save(doc)
    })
  }

  const create = (data) => {
    const cleanData = clean(data)
    console.log('framework service: data', cleanData)
    return new Promise((resolve, reject) => {
      _models.framework.create(cleanData, (err, results) => {
        console.log('framework service: err', err)
        if (err) {
          return reject(err)
        }
        return resolve(results)
      })
    })
  }

  return {
    get,
    create,
    findUpdateAndSave
  }
}

exports = module.exports = frameworkService