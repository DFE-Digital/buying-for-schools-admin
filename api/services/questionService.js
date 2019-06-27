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

  const findOneAndUpdate = (criteria, data, options = {}) => {
    console.log({criteria, data, options})
    return new Promise((resolve, reject) => {
      
      _models.question.findOneAndUpdate(criteria, data, options, (err, results) => {
        // console.log({err, results})
        if (err) {
          if (err.code === 11000) {
            return reject({ err: 'validation', msg: 'Validation errors', errors: [{ id: 'ref', msg: 'Ref must be unique' }] })     
          }
          return reject({ err: err.code, msg: err.errmsg })
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
        // console.log(err.errors.ref.message)
        const errorMessages = Object.keys(err.errors).map(k => {
          return { id: k, msg: err.errors[k].message }
        })
        if (err) {
          return reject(errorMessages)
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
    create
  }
}

exports = module.exports = questionService