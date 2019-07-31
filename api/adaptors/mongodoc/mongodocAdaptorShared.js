
const mongodocAdaptorShared = model => {
  const getRecordById = id => {
    return new Promise((resolve, reject) => {
      model.findOne({ _id: id }, (err, doc) => {
        if (err) {
          return reject(err)
        }
        return resolve(doc)
      })
    })
  }
  const getRecord = (status = 'DRAFT') => {
    return new Promise((resolve, reject) => {
      model.findOne({ status }, (err, doc) => {
        if (err) {
          return reject(err)
        }
        return resolve(doc)
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

  return {
    getRecord,
    getRecordById,
    save
  }
}

module.exports = mongodocAdaptorShared