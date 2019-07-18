const mongoAdaptorQuestion = (models) => {
  const clean = data => {
    delete(data._id)
    delete(data.__v)
    if (!data.options) {
      return data
    }
    data.options.forEach(opt => {
      delete(opt.__v)
      if (!opt.next) {
        opt.next = null
      }
      if (opt._id === 'new') {
        delete(opt._id)
      }
    })
    return data
  }

  const populationCallback = query => {
    return query
    .populate({ path: 'options', populate: { path: 'result' }})
    .populate('options.next')
  }

  const list = (criteria = {}, populate = false) => {
    return models.list(models.question, criteria, populate ? populationCallback: null)
  }

  const get = (id, populate = false) => {
    return models.get(models.question, id, populate ? populationCallback: null)
  }

  const put = (id, data) => models.put(get)(id, clean(data))

  const create = (data) => models.create(models.question, clean(data))

  const remove = (id) => models.remove(models.question, id)

  const linkToOption = (question, parentId, optionId) => {
    return new Promise((resolve, reject) => {
      const criteria = { _id: parentId, "options._id": optionId }
      const updateData = { 
        "$set": {
          "options.$.next": question,
          "options.$.result": [],
        }
      }

      if (!parentId || !optionId) {
        return resolve(question)
      }

      models.question.findOneAndUpdate(criteria, updateData, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(question)  
      })
    })
  }
  
  return {
    clean,
    list,
    get,
    put,
    create,
    remove,
    linkToOption
  }
}

module.exports = mongoAdaptorQuestion