const shortid = require('shortid')

let recordCache = {}

exports = module.exports = (dataSource) => {
  const { db } = dataSource

  const wait = (ms) => {
    return new Promise(resolve => {      
      setTimeout(resolve, ms)
    })
  }

  const createRecord = (model, data) => {
    return new Promise((resolve, reject) => {
      const newData = {...data, _id: shortid.generate()}
      db.get(model).push(newData).write()
      return resolve(newData)
    })
  }

  const removeAllRecords = (model) => {
    return new Promise(resolve => {
      db.set(model, []).write()
      return resolve()
    })
  }

  const dropCollections = () => {
    
    return dropCollection('question')
    .then(() => dropCollection('framework'))
    .then(() => wait(1000))
  }

  const dropCollection = (collectionName) => {
    return new Promise((resolve, reject) => {  
      // no need for lowdb
      return resolve()
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