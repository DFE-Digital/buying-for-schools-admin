const shortid = require('shortid')
const p = result => new Promise(resolve => resolve(result))
const modelName = 'question'
const lowdbAdaptorGeneric = require('./lowdbAdaptorGeneric')
const validateQuestionRef = RegExp(/^[a-z-]*$/)

const lowdbAdaptorQuestion = (db) => {
  const generic = lowdbAdaptorGeneric(db, 'question')

  const clean = data => {
    data.title = data.title.trim
    if (!data.options) {
      data.options = []
    }
    data.options = data.options.map(opt => {
      if (!opt._id) {
        opt._id = shortid()
      }
      return opt
    })
    return data
  }

  const validation = data => {
    if (!data.title) {
      return { errors: {title: 'A title is required'}}
    }
    if (!data.ref || !validateQuestionRef.test(data.ref)) {
      return { errors: {ref: 'A reference must contain only a-z and dashes'}}
    }
    return true
  }

  const create = (data) => {
    return new Promise((resolve, reject) => {
      data = clean(data)

      const existing = db.get('question').find({ ref: data.ref }).value()
      if (existing) {
        return reject({ code: 11000 })
      }
      const errors = validation(data).errors
      if ( errors ) {
        return reject(errors)
      }

      resolve(generic.create(data))
    })
  }

  const put = (id, data) => {
    return new Promise((resolve, reject) => {
      data = clean(data)

      const existing = db.get('question').find({ ref: data.ref }).value()
      if (existing && existing._id !== id) {
        return reject({ code: 11000 })
      }

      const errors = validation(data).errors
      if ( errors ) {
        return reject(errors)
      }

      resolve(generic.put(id, data))
    })
  }
  // const create = (data) => {
  //   const newData = {...data, _id: shortid.generate()}
  //   db.get(modelName).push(newData).write()
  //   return p(newData)
  // }
 
  // const remove = (id) => p(db.get(modelName).remove(record => record._id === id).write())

  const linkToOption = (question, parentId, optionId) => {
    if (!parentId || !optionId) {
      return p(question)
    }

    return generic.get(parentId)
    .then(parent => {
      const { options } = parent
      const optionToUpdate = options.find(opt => opt._id === optionId)
      if (optionToUpdate) {
        optionToUpdate.next = question._id,
        optionToUpdate.result = []
      }
      return generic.put(parentId, parent)
    }).then(() => question)
  }

  return {
    ...generic,
    // clean,
    // list,
    put,
    create,
    // create,
    // remove,
    linkToOption
  }
}


module.exports = lowdbAdaptorQuestion