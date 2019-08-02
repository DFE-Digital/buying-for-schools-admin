const mongodocAdaptorShared = require('./mongodocAdaptorShared')

const mongodocAdaptorManagement = model => {
  const shared = mongodocAdaptorShared(model)

  const createDoc = doc => {
    return new Promise((resolve, reject) => {
      model.create(doc, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      })
    })
  }

  const archive = doc => {
    if (!doc) {
      return Promise.resolve()
    }
    doc.status = 'ARCHIVE'
    doc.archived = {
      date: Date.now(),
      note: 'Hello'
    }
    return shared.save(doc)
  }

  const getIDs = doc => {
    const idList = {
      category: {},
      provider: {},
      framework: {},
      question: {}
    }

    doc.category.forEach(c => {
      idList.category[c._id.toString()] = c.title
    })

    doc.provider.forEach(p => {
      idList.provider[p._id.toString()] = p.title
    })

    doc.framework.forEach(f => {
      idList.framework[f._id.toString()] = f.ref
    })

    doc.question.forEach(q => {
      idList.question[q._id.toString()] = q.ref
    })

    return idList
  }

  const findNewId = (oldids, newids, id) => {
    if (!id) {
      return null
    }
    const idString = id.toString()
    const oldValue = oldids[idString]
    return Object.keys(newids).find(k => newids[k] === oldValue)
  }

  const updateRefs = (oldids, newids, newLiveDoc) => {
    newLiveDoc.framework.forEach(f => {
      f.cat = findNewId(oldids.category, newids.category, f.cat)
      f.provider = findNewId(oldids.provider, newids.provider, f.provider)
    })

    newLiveDoc.question.forEach(q => {
      q.options.forEach(opt => {
        opt.next = findNewId(oldids.question, newids.question, opt.next)
        opt.result = opt.result.map(res => findNewId(oldids.framework, newids.framework, res))
      })
    })
    return Promise.resolve(newLiveDoc)
  }
  
  const stripIDs = doc => {
    const newdoc = {
      category: [],
      provider: [],
      framework: [],
      question: []
    }

    newdoc.category = doc.category.map(c => {
      const newCat = {...c}
      delete(newCat._id)
      delete(newCat.__v)
      return newCat
    })

    newdoc.provider = doc.provider.map(p => {
      const newProv = {...p}
      delete(newProv._id)
      delete(newProv.__v)
      return newProv
    })

    newdoc.framework = doc.framework.map(f => {
      const newFra = {...f}
      delete(newFra._id)
      delete(newFra.__v)
      return newFra
    })

    newdoc.question = doc.question.map(q => {
      const newQ = {...q}
      delete(newQ._id)
      delete(newQ.__v)
      newQ.options = newQ.options.map(opt => {
        const newOpt = {...opt}
        delete(newOpt._id)
        delete(newOpt.__v)
        return newOpt
      })
      return newQ
    })
    return newdoc
  }


  const isValidStatusFlow = (doc, data) => {
    switch(doc.status) {
      case 'DRAFT': {
        return data.status === 'LIVE'
      }
      case 'LIVE': {
        return data.status === 'ARCHIVE'
      }
      default: {
        return false
      }
    }
  }

  const ensureCorrectStatusFlow = (doc, data) => {
    const isValid = isValidStatusFlow(doc, data)
    if (isValid) {
      return Promise.resolve()
    }

    switch(doc.status) {
      case 'DRAFT': {
        return Promise.reject({ errors: { statusflow: { message: 'DRAFT MUST GO LIVE' }}})
      }
      case 'LIVE': {
        return Promise.reject({ errors: { statusflow: { message: 'LIVE MUST BE ARCHIVED' }}})
      }
      default: {
        return Promise.reject({ errors: { statusflow: { message: 'STATUS CANNOT BE CHANGED' }}})
      }
    }
  }

  const cloneDoc = (doc, updates) => {
    const sourceDoc = doc.toObject()
    const oldids = getIDs(sourceDoc)
    const strippedOfIds = stripIDs(sourceDoc)
    let newDoc
    let newids
    return createDoc(strippedOfIds)
      .then(d => newDoc = d)
      .then(() => newids = getIDs(newDoc))
      .then(() => updateRefs(oldids, newids, newDoc))
      .then(() => applyUpdates(newDoc, updates))
      .then(() => shared.save(newDoc))
  }

  const applyUpdates = (doc, updates) => {
    if (updates.status) {
      doc.status = updates.status  
    }

    if (updates.published) {
      doc.published = updates.published
    }

    if (updates.archived) {
      doc.archived = updates.archived
    }
    
    return doc
  }

  const structure = {
    list: () => {
      return new Promise((resolve, reject) => {
        model
        .find()
        .select('published archived status createdAt updatedAt')
        .sort({ 'updatedAt': 'desc' })
        .exec((err, result) => {
          if (err) {
            return reject(err)
          }
          return resolve(result)
        })
      })
    },

    put: (id, data) => {
      let doc
      return shared.getRecordById(id)
        .then(d => doc = d)
        .then(() => ensureCorrectStatusFlow(doc, data))
        .then(() => applyUpdates(doc, data))
        .then(() => shared.save(doc))
    },

    post: data => {
      if (!data.source) {
        return Promise.reject({ errors: { source: { message: 'source ID was not specified' }}})
      }

      return shared.getRecordById(data.source)
        .then(d => cloneDoc(d, data))
    },

    remove: id => {
      return new Promise((resolve, reject) => {
        model.deleteOne({ _id: id }, (err, results) => {
          if (err) {
            return reject(err)
          }
          if (results.deletedCount === 0) {
            return reject({ code: 404 })
          }
          return resolve(results)
        })
      })
    }
  }

  return {
    structure
  }
}

module.exports = mongodocAdaptorManagement