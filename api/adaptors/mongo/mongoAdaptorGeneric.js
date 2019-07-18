const mongoAdaptorGeneric = (models, modelName) => {
  const clean = data => {
    delete(data.__v)
    delete(data._id)
    return data
  }

  const list = (criteria = {}) => models.list(models[modelName], criteria)

  const get = (id, populate = false) => models.get(models[modelName], id)

  const put = (id, data) => models.put(get)(id, clean(data))

  const create = (data) => models.create(models[modelName], clean(data))
 
  const remove = (id) => models.remove(models[modelName], id)

  return {
    clean,
    list,
    get,
    put,
    create,
    remove
  }
}


module.exports = mongoAdaptorGeneric