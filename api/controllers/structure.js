const shared = require('./shared')
const webhookService = require('../services/webhookService')

const structureController = (dataSource) => {
  const populateFrameworkReferences = (frameworks, categories, providers) => {
    const populatedFrameworks = frameworks.map(f => {
      if (f.cat) {
        f.cat = JSON.parse(JSON.stringify(categories.filter(c => c._id.toString() === f.cat.toString())[0]))
        delete f.cat._id
      }
      if (f.provider) {
        f.provider = JSON.parse(JSON.stringify(providers.filter(p => p._id.toString() === f.provider.toString())[0]))
        delete f.provider._id
      }
      delete f._id
      return f
    })
    return populatedFrameworks
  }

  const me = {
    list: (req, res) => {
      dataSource.structure.list()
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },
    get: (req, res) => {
      dataSource.structure.get(req.params.structureId)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },
    post: (req, res) => {
      dataSource.structure.post(req.body)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },
    put: (req, res) => {
      dataSource.structure.put(req.params.structureId, req.body)
      .then(results => {
        res.send(results)
        if (results.status === 'LIVE') {
          const frameworks = results.framework.map(f => f.toJSON())
          const categories = results.category.map(c => c.toJSON())
          const providers = results.provider.map(p => p.toJSON())
          const populatedFrameworks = populateFrameworkReferences(frameworks, categories, providers)
          webhookService.send(populatedFrameworks)
        }
      })
      .catch(err => shared.stdErrorResponse(res, err))
    },
    remove: (req, res) => {
      dataSource.structure.remove(req.params.structureId)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },
    populateFrameworkReferences: populateFrameworkReferences
  }

  return me
}

exports = module.exports = structureController