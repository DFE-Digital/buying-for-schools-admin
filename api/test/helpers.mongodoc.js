let recordCache = {}

exports = module.exports = (dataSource) => {
  const wait = (ms) => {
    return new Promise(resolve => {      
      setTimeout(resolve, ms)
    })
  }

  const createRecord = (modelName, data) => {
    return new Promise((resolve, reject) => {

      dataSource.model.findOne({ status:'DRAFT' }).exec((err, doc) => {
        doc[modelName].push(data)
        doc.save((err, result) => {
          const newRecord = result[modelName][result[modelName].length -1]
          recordCache[newRecord.ref] = newRecord.toObject()
          resolve(newRecord)
        })
        
      })
    })
  }

  const removeAllRecords = (modelName) => {
    return new Promise(resolve => {
      dataSource.model.findOne({ status:'DRAFT' }).exec((err, doc) => {
        if (!doc) {
          doc = {
            status: "DRAFT",
            framework: [],
            question: [],
            category: [],
            provider: []
          }
          dataSource.model.create(doc, (err, result) => {
            resolve(result)
          })
          return
        }

        doc[modelName] = []
        doc.save((err, result) => {
          if (err) {
            return reject(err)
          }
          return resolve(result)
        })
      })
    })
  }

  const dropCollections = collectionName => {
    return new Promise((resolve, reject) => {  
      dataSource.model.collection.drop((err, res) => {
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
    dropCollections
  }
}