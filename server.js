const express = require('express')
const app = express()
const path = require('path')
const port = 4000
const fs = require('fs')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const frameworksTemplatePath = path.resolve(__dirname, '../buying-for-schools/app/templates/frameworks/')
const treePath = path.resolve(__dirname, 'tree.json')
const tree = JSON.parse(fs.readFileSync(treePath))

const treeHierarchy = (thetree, ref, depth = 0) => {
  if (!ref) {
    ref = thetree[0].ref
  }

  const thisBranch = thetree.find(branch => branch.ref === ref)
  if (!thisBranch) {
    return null
  }
  thisBranch.used = true
  const newEntry = {
    ref,
    title: thisBranch.title,
    depth,
    options: [],
    decendants: 0
  }

  newEntry.options = thisBranch.options.map(opt => {
    const newOpt = {
      ref: opt.ref,
      title: opt.title || opt.ref,
      result: opt.result || undefined,
      decendants: 1
    }

    if (opt.result) {
      newOpt.templateExists = fs.existsSync(path.join(frameworksTemplatePath, opt.result + '.njk'))
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

app.get('/api/decision-tree', (req, res) => {
  res.send({
    hierarchy: treeHierarchy(tree),
    tree
  })
})

app.put('/api/question/:qref', (req, res) => {
  const currentRef = req.params.qref
  const currentEntry = tree.find(branch => branch.ref === currentRef)
  console.log(currentRef)
  console.log(currentEntry)

  if (!currentEntry) {
    res.statusCode = 400
    return res.send({})
  }

  currentEntry.title = req.body.title
  currentEntry.ref = req.body.ref

  save()

  res.send({
    hierarchy: treeHierarchy(tree),
    tree
  })
})

app.post('/api/question/:qref/answer', (req, res) => {
  const currentRef = req.params.qref
  const currentEntry = tree.find(branch => branch.ref === currentRef)
  if (!currentEntry) {
    res.statusCode = 400
    return res.send({})
  }

  currentEntry.options.push({
    ref: req.body.ref,
    title: req.body.title,
    next: req.body.next,
    result: req.body.result
  })

  save()
  res.send({
    hierarchy: treeHierarchy(tree),
    tree
  })
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

  createNextBranchIfRequired(currentAnswer.next)

  save()

  res.send({
    hierarchy: treeHierarchy(tree),
    tree
  })
})


app.listen(port, function () {
  console.log('Magic happens on port ' + port)
})
