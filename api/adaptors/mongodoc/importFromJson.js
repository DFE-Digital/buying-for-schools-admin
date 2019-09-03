const connectionString = process.env.S107D01_MONGO_01
// const connectionString = process.env.S107D01_MONGO_01.replace(/\/s107d01-mongo-01\?/, '/testing?')

const frameworkData = require('../../../../buying-for-schools-v1/app/data/frameworks')
const categoryData = require('../../../../buying-for-schools-v1/app/data/categories')
const questionData = require('../../../../buying-for-schools-v1/app/data/tree')

const modelTemplate = require('./model')

const prepNewData = () => {
  const data = {
    status: 'DRAFT',
    framework: [],
    question: [],
    category: [],
    provider: []
  }

  data.category = categoryData.map(c => {
    return { title: c.title }
  })

  const providers = []
  frameworkData.forEach(f => {
    if (!providers.includes(f.supplier) && f.supplier) {
      providers.push(f.supplier)
    }
  })

  data.provider = providers.map(p => {
    return { initials: p, title: p }
  })

  data.framework = frameworkData.map(f => {
    return {
      ref: f.ref,
      title: f.title,
      url: f.url,
      descr: f.descr,
      expiry: f.expiry
    }
  })

  data.question = questionData.map(q => {
    const options = q.options.map(opt => {
      return {
        ref: opt.ref,
        title: opt.title,
        hint: opt.hint || ''
      }
    })
    return {
      ref: q.ref,
      title: q.title,
      err: q.err || '',
      hint: q.hint || '',
      suffix: q.suffix || '',
      options
    }
  })
  return data
}


const createRecord = (model, data) => {
  return new Promise((resolve, reject) => {
    model.create(data, (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  })
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

const resync = (newids, doc) => {
  frameworkData.forEach((f, i) => {
    doc.framework[i].provider = Object.keys(newids.provider).find(id => f.supplier === newids.provider[id])
    const originalCatIndex = categoryData.findIndex(c => c.ref === f.cat)
    doc.framework[i].cat = Object.keys(newids.category)[originalCatIndex]
  })

  questionData.forEach((q, i) => {
    q.options.forEach((opt, j) => {
      doc.question[i].options[j].next = Object.keys(newids.question).find(id => opt.next === newids.question[id])
      if (opt.result) {
        doc.question[i].options[j].result = opt.result.map(fref => {
          return Object.keys(newids.framework).find(id => fref === newids.framework[id])
        })
      }
    })
  })

  return doc
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


const go = async () => {
  try {
    const model = await modelTemplate(connectionString)
    const newData = prepNewData()
    const newDoc = await createRecord(model, newData)
    const newIds = getIDs(newDoc)
    resync(newIds, newDoc)
    await save(newDoc)
    console.log(newDoc)
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

go()

/*
createRecord(prepNewData())
.then(d => newdoc = d)
.then(() => newids = getIDs(newdoc))
.then(() => resync(newids, newdoc))
.then(() => save(newdoc))
.then(result => {
  console.log(JSON.stringify(questionData[1], null, '  '))
  console.log(newids.framework)
  console.log(JSON.stringify(result.question[1], null, '  '))
  process.exit()
})
.catch(err => {
  console.log(err)
  process.exit(1)
})

*/