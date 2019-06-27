let recordCache = {}

exports = module.exports = (app) => {
  const createRecord = (model, data) => {
    return new Promise(resolve => {
      app.models[model].create(data, (err, result) => {
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

  return {
    removeAllRecords,
    createRecord,
    recordCache
  }
}