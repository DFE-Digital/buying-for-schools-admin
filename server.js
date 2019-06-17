const express = require('express')
const app = express()
const path = require('path')
const port = 4000
const fs = require('fs')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const dataPath = path.resolve(__dirname, '../buying-for-schools/app/data')
const frameworksTemplatePath = path.resolve(__dirname, '../buying-for-schools/app/templates/frameworks/')
let frameworksPath = path.resolve(dataPath, 'frameworks.json')
let treePath = path.resolve(dataPath, 'tree.json')
let tree = JSON.parse(fs.readFileSync(treePath))
let frameworks = JSON.parse(fs.readFileSync(frameworksPath))



const treeHierarchy = (thetree, ref, depth = 0) => {
  if (!ref) {
    ref = thetree[0].ref
  }

  const thisBranch = thetree.find(branch => branch.ref === ref)
  if (!thisBranch) {
    return null
  }

  const newEntry = {
    ref,
    title: thisBranch.title,
    hint: thisBranch.hint,
    err: thisBranch.err,
    depth,
    options: [],
    decendants: 0
  }

  newEntry.options = thisBranch.options.map(opt => {
    const newOpt = {
      ref: opt.ref,
      title: opt.title || opt.ref,
      result: opt.result || undefined,
      hint: opt.hint,
      decendants: 1
    }

    if (opt.next) {
      newOpt.next = treeHierarchy(thetree, opt.next, depth +1)
      if (newOpt.next) {
        newOpt.decendants = newOpt.next.decendants
      } else {
        newOpt.next = opt.next
      }
    }
    newEntry.decendants += newOpt.decendants
    return newOpt
  })

  return newEntry
}

const createNextBranchIfRequired = (ref) => {
  const existingBranch = tree.find(branch => branch.ref === ref)
  if (!existingBranch) {
    tree.push({ ref, title: 'New branch with ref ' + ref, options: [] })
  }
}

const save = () => {
  fs.renameSync(treePath, path.resolve(__dirname, 'backup/' + new Date().toISOString() + '.json'))
  fs.writeFile(treePath, JSON.stringify(tree, null, '  '), 'utf8', err => {
     if (err) {
       throw(err)
     }
  })
}

const saveFramework = () => {
  fs.renameSync(frameworksPath, path.resolve(__dirname, 'backup/framework-' + new Date().toISOString() + '.json'))
  const cleanFrameworks = frameworks.map(f => {
    return {
      ref: f.ref,
      title: f.title,
      supplier: f.supplier,
      url: f.url,
      cat: f.cat
    }
  })
  fs.writeFile(frameworksPath, JSON.stringify(cleanFrameworks, null, '  '), 'utf8', err => {
     if (err) {
       throw(err)
     }
  })
}

const stdResponse = () => {
  const frameworksInfo = frameworks.map(f => {
    return {
      ...f,
      templateExists: fs.existsSync(`${frameworksTemplatePath}/${f.ref}.njk`)
    }
  })
  return {
    hierarchy: treeHierarchy(tree),
    tree,
    frameworks: frameworksInfo,
    dataSets: [
      "default",
      "mock-animals"
    ]
  }
}

app.put('/api/dataset', (req, res) => {
  const d = req.body.dataSet
  switch(d) {
    case 'mock-animals': {
      treePath = path.join(dataPath, `mocks/animals/animal-tree.json`)
      frameworksPath = path.join(dataPath, `mocks/animals/animal-frameworks.json`)
      break
    }

    default: {
      treePath = path.join(dataPath, 'tree.json')
      frameworksPath = path.join(dataPath, 'frameworks.json')
    }
  }

  
  tree = JSON.parse(fs.readFileSync(treePath))
  frameworks = JSON.parse(fs.readFileSync(frameworksPath))

  res.send(stdResponse())
})

app.get('/api/decision-tree', (req, res) => {
  res.send(stdResponse())
})

app.put('/api/question/:qref', (req, res) => {
  const currentRef = req.params.qref
  const currentEntry = tree.find(branch => branch.ref === currentRef)

  if (!currentEntry) {
    res.statusCode = 400
    return res.send({})
  }

  currentEntry.title = req.body.title
  currentEntry.ref = req.body.ref
  currentEntry.hint = req.body.hint
  currentEntry.err = req.body.err

  save()

  res.send(stdResponse())
})

app.delete('/api/question/:qref', (req, res) => {
  const currentRef = req.params.qref
  const currentEntry = tree.find(branch => branch.ref === currentRef)

  if (!currentEntry) {
    res.statusCode = 400
    return res.send({})
  }

  tree = tree.filter(branch => branch.ref !== currentRef)
  save()

  res.send(stdResponse())
})

app.post('/api/question/:qref/answer', (req, res) => {
  const currentRef = req.params.qref
  const currentEntry = tree.find(branch => branch.ref === currentRef)
  if (!currentEntry) {
    res.statusCode = 400
    return res.send({})
  }

  const result = req.body.result || ''

  currentEntry.options.push({
    ref: req.body.ref,
    title: req.body.title,
    next: req.body.next,
    result: (result.pop) ? result: result.split(',')
  })

  save()
  res.send(stdResponse())
})

app.put('/api/question/:qref/answer/:ansref', (req, res) => {
  const currentRef = req.params.qref
  const currentEntry = tree.find(branch => branch.ref === currentRef)
  const currentAnsref = req.params.ansref
  const currentAnswer = currentEntry.options.find(opt => opt.ref === currentAnsref)

  if (!currentEntry || !currentAnswer) {
    res.statusCode = 400
    return res.send({})
  }

  currentAnswer.title = req.body.title
  currentAnswer.ref = req.body.ref
  currentAnswer.next = req.body.next
  currentAnswer.result = req.body.result
  currentAnswer.hint = req.body.hint

  createNextBranchIfRequired(currentAnswer.next)

  save()
  res.send(stdResponse())
})

app.delete('/api/question/:qref/answer/:ansref', (req, res) => {
  const currentRef = req.params.qref
  const currentEntry = tree.find(branch => branch.ref === currentRef)
  const currentAnsref = req.params.ansref
  if (!currentEntry) {
    res.statusCode = 400
    return res.send({})
  }

  currentEntry.options = currentEntry.options.filter(opt => opt.ref !== currentAnsref)

  save()
  res.send(stdResponse())
})

app.put('/api/framework/:ref', (req, res) => {
  const currentRef = req.params.ref
  const currentEntry = frameworks.find(f => f.ref === currentRef)
  if (!currentEntry) {
    res.statusCode = 400
    return res.send({})
  }

  currentEntry.ref = req.body.ref
  currentEntry.title = req.body.title  
  currentEntry.supplier = req.body.supplier 
  currentEntry.url = req.body.url
  currentEntry.cat = req.body.cat

  saveFramework()
  res.send(stdResponse())
})

app.post('/api/framework', (req, res) => {
  const currentEntry = frameworks.find(f => f.ref === req.body.ref)
  if (currentEntry) {
    res.statusCode = 400
    return res.send({})
  }

  newEntry = {
    ref: req.body.ref,
    title: req.body.title,
    supplier: req.body.supplier,
    url: req.body.url,
    cat: req.body.cat
  }
  frameworks.push(newEntry)
  saveFramework()
  res.send(stdResponse())
})

app.listen(port, function () {
  console.log('Magic happens on port ' + port)
})
