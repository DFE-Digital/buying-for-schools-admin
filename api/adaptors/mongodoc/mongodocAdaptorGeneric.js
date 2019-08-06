const util = require('util')
const validateQuestionRef = RegExp(/^[a-z-]*$/)
const isObject = obj => obj === Object(obj)
const mongodocAdaptorShared = require('./mongodocAdaptorShared')

const mongodocAdaptorGeneric = model => {
  const shared = mongodocAdaptorShared(model)

  const cleanData = data => {
    if (Array.isArray(data)) {
      return data.map(entry => cleanData(entry))
    }

    if (!isObject(data)) {
      return data
    }

    const newData = {...data}
    if (newData._id === 'new') {
      delete(newData._id)
    }

    const idrefs = ['provider', 'cat', 'next']
    idrefs.forEach(k => {
      if (newData[k] === '') {
        newData[k] = null
      }  
    })
    
    Object.keys(newData).forEach(k => {
      newData[k] = cleanData(newData[k])
    })
    return newData
  }

  const validation = data => {
    if (!data.title) {
      return { errors: {title: 'A title is required'}}
    }
   
    for (let i in data.options) {
      const opt = data.options[i]
      const retval = { errors: {}}

      if (!opt.ref  || !validateQuestionRef.test(opt.ref)) {
        retval.errors[`options.${i}.ref`] = 'A reference must contain only a-z and dashes'
        return retval
      }
      if (!opt.title) {
        retval.errors[`options.${i}.title`] = 'A title is required'
        return retval
      }
      i++
    }

    return true
  }

  const ensureTitleIsPresent = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.title || !data.title.trim()) {
        return reject({ errors: {title: 'A title is required'}})
      }
      return resolve(data)  
    })
  }

  const ensureRefIsUniqueAndValid = (modelName, doc, data, id = null) => {
    if (modelName === 'provider') {
      return Promise.resolve(doc)
    }
    const existing = doc[modelName].find(item => item.ref === data.ref)
    if (existing && existing._id.toString() !== id) {
      return Promise.reject({ code: 11000 })
    }

    if (id && data.ref === undefined) {
      return Promise.resolve(doc)      
    }

    if (!data.ref || !validateQuestionRef.test(data.ref)) {
      return Promise.reject({ errors: {ref: 'A reference must contain only a-z and dashes'}})
    }

    return Promise.resolve(doc)
  }  

  const ensureOptionsAreValid = (item) => {
    if (!item.options) {
      return Promise.resolve(item)
    }

    const retval = { errors: {}}
    for (let i = 0; i < item.options.length; i++) {
      const opt = item.options[i]
      
      if (!opt.ref  || !validateQuestionRef.test(opt.ref)) {
        retval.errors[`options.${i}.ref`] = 'A reference must contain only a-z and dashes'
      }
      if (!opt.title) {
        retval.errors[`options.${i}.title`] = 'A title is required'
      }
    }

    if (Object.keys(retval.errors).length) {
      return Promise.reject(retval)
    }

    return Promise.resolve(item)
  }

  const findSpecificItem = (modelName, doc, id) => {
    const item = doc[modelName].find(item => item._id.toString() === id)
    if (item) {
      return Promise.resolve(item)
    }
    return Promise.reject({ code: 404 })
  }
  
  const generic = modelName => {
    return {
      list: () => {
        return shared.getRecord()
        .then(doc => {
          return doc[modelName]
        })
      },
      get: id => {
        let doc
        return shared.getRecord()
        .then(d => doc = d)
        .then(() => findSpecificItem(modelName, doc, id))
      },
      create: (raw) => {
        let doc
        const data = cleanData(raw)

        return ensureTitleIsPresent(data)
        .then(() => shared.getRecord())
        .then(d => doc = d)
        .then(() => ensureRefIsUniqueAndValid(modelName, doc, data))
        .then(() => doc[modelName].push(data))
        .then(() => ensureOptionsAreValid(data, doc))
        .then(() => shared.save(doc))
        .then((newDoc) => {
          return newDoc[modelName][newDoc[modelName].length -1]
        })
      },
      put: (id, raw) => {
        let doc
        const data = cleanData(raw)
        return shared.getRecord()
        .then(d => doc = d)
        .then(() => ensureRefIsUniqueAndValid(modelName, doc, data, id))
        .then(() => findSpecificItem(modelName, doc, id))
        .then(item => {
          for (let p in data) {
            item[p] = data[p]
          }
          return ensureOptionsAreValid(item)
        })
        .then(item => ensureTitleIsPresent(item))
        .then(() => shared.save(doc))
        .then(updatedDoc => {
          const updatedItem = updatedDoc[modelName].find(p => p._id.toString() === id)
          return updatedItem
        })
      },
      remove: (id) => {
        let doc
        return shared.getRecord()
        .then(d => doc = d)
        .then(() => findSpecificItem(modelName, doc, id))
        .then(() => {
          doc[modelName] = doc[modelName].filter(p => p._id.toString() !== id)
          return shared.save(doc)
        })
        .then(updatedDoc => {
          const after = updatedDoc[modelName].length
          const before = doc[modelName].length
          return { n: before - after }
        })
      }
    }
  }

  const framework = { 
    ...generic('framework')
  }
  const question = { 
    ...generic('question'),
    linkToOption: (question, parentId, optionId) => {
      if (!parentId || !optionId) {
        return question
      }
      return shared.getRecord()
      .then(doc => {
        const parentQ = doc.question.find(q => q._id.toString() === parentId)
        const option = parentQ.options.find(o => o._id.toString() === optionId)
        option.next = question._id
        option.result = []
        return shared.save(doc)
      }).then(doc => {
        return question
      })
    }
  }

  return {
    framework,
    question,
    provider: generic('provider'),
    category: generic('category'),
  }
}

module.exports = mongodocAdaptorGeneric