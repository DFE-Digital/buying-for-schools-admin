const mongoAdaptorFramework = (models) => {

  const populationCallback = query => {
    return query.populate('provider').populate('cat')
  }

  const clean = data => {
    delete(data.__v)
    delete(data._id)
    return data
  }

  const list = (criteria = {}, populate = false) => {
    return models.list(models.framework, criteria, populate ? populationCallback: null)
  }

  const get = (id, populate = false) => {
    return models.get(models.framework, id, populate ? populationCallback: null)
  }

  const put = (id, data) => models.put(get)(id, clean(data))

  const create = (model) => models.create(model, clean(data))
 
  const remove = (id) => models.remove(models.framework, id)

  return {
    clean,
    list,
    get,
    put,
    create,
    remove
  }
}


module.exports = mongoAdaptorFramework