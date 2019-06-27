let _models = null

const questionService = (models = null) => {
  if (models) {
    _models = models
  }

  const get = (criteria) => {
    return new Promise((resolve, reject) => {
      _models.question.findOne(criteria, (err, results) => {
        if (err) {
          return reject(err)
        }

        return resolve(results)
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

  const getByRef = (ref) => {
    return get({ ref })
  }

  const getByOptionWithNext = (nxt) => {
    return get({options: {"$elemMatch": {next: nxt}}})
  }

  const getHierarchy = (ref) => {
    return new Promise((resolve, reject) => {
      let startQuestion = null
      let hierarchy = []
      const ids = []
      const getHierarchyRecur = (ref) => {
        getByOptionWithNext(ref).then(q => {
          if (!q) {
            // not found so return what we've got
            return resolve(hierarchy)
          }

          if (ids.includes(q.ref)) {
            // avoid circular repetition
            return resolve(hierarchy)
          }

          ids.push(q.ref)
          hierarchy.push({question: q, selectedOption: q.options.find(opt => opt.next === ref)})
          return getHierarchyRecur(q.ref)
        })
      }
      getByRef(ref).then(q => {
        startQuestion = q
        getHierarchyRecur(q.ref)
      })
    })
  }

  const findUpdateAndSave = (criteria, data) => {
    return get(criteria).then(doc => {
      Object.keys(data).forEach(k => {
        // console.log(`setting ${k} to "${data[k]}"`)
        doc[k] = data[k]
      })
      // console.log(doc)
      return save(doc)
    })
  }

  const findOneAndUpdate = (criteria, data, options = {}) => {
    // console.log(data)
    return new Promise((resolve, reject) => {

      _models.question.findOneAndUpdate(criteria, { '$set': data }, options, (err, results) => {
        if (err) {
          return reject(err)
        }
        if (!results) {
          return resolve({ success: true })
        }

        return resolve(results)
      })
    })
  }

  const create = (data) => {
    return new Promise((resolve, reject) => {
      _models.question.create(data, (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      })
    })
  }

  return {
    get,
    getByRef,
    getByOptionWithNext,
    getHierarchy,
    findOneAndUpdate,
    findUpdateAndSave,
    create,
    save
  }
}

exports = module.exports = questionService