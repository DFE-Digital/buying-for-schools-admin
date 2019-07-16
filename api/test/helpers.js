let recordCache = {}

exports = module.exports = (app) => {
  const wait = (ms) => {
    return new Promise(resolve => {      
      setTimeout(resolve, ms)
    })
  }

  const createRecord = (model, data) => {
    return new Promise((resolve, reject) => {
      app.models[model].create(data, (err, result) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        recordCache[result.ref] = result.toObject()
        resolve(result)
      })
    })
  }

  const removeAllRecords = (model) => {
    return new Promise(resolve => {
      app.models[model].deleteMany({}, (err) => {
        resolve()
      })
    })
  }

  const dropCollections = () => {
    
    return dropCollection('question')
    .then(() => dropCollection('framework'))
    .then(() => wait(1000))
  }

  const dropCollection = (collectionName) => {
    return new Promise((resolve, reject) => {  
      app.models[collectionName].collection.drop((err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(res)
      })
    })
  }

  return {
    wait,
    removeAllRecords,
    createRecord,
    recordCache,
    dropCollection,
    dropCollections
  }
}