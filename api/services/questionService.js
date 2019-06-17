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
    return get({options: {"$elemMatch": { next: nxt}}})
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

  return {
    get,
    getByRef,
    getByOptionWithNext,
    getHierarchy
  }
}

exports = module.exports = questionService