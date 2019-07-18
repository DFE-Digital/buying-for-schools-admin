const shortid = require('shortid')
const p = result => new Promise(resolve => resolve(result))
const modelName = 'framework'

const lowdbAdaptorFramework = (db) => {

  const clean = data => {
    delete(data.__v)
    delete(data._id)
    return data
  }

  const list = (criteria = {}, populate = false) => p(db.get(modelName).value())

  const get = id => p(db.get(modelName).find({ _id: id }).value())
  
  const put = (id, data) => p(db.get(modelName).find({ _id: id }).assign(data).write())

  const create = (data) => {
    const newData = {...data, _id: shortid.generate()}
    db.get(modelName).push(newData).write()
    return p(newData)
  }
 
  const remove = (id) => p(db.get(modelName).remove(record => record._id === id).write())

  return {
    clean,
    list,
    get,
    put,
    create,
    remove
  }
}


module.exports = lowdbAdaptorFramework