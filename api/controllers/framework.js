
const shared = require('./shared')
const webhookService = require('../services/webhookService')

const frameworkController = (dataSource) => {
  const populateReferences = async (framework) => {
    if (framework.cat) {
      framework.cat = (await dataSource.category.get(framework.cat.toString())).toJSON()
      delete framework.cat._id
    }
    if (framework.provider) {
      framework.provider = (await dataSource.provider.get(framework.provider.toString())).toJSON()
      delete framework.provider._id
    }
    delete framework._id
    return framework
  }

  return {
    list: (req, res) => {
      dataSource.framework.list()
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    get: (req, res) => {
      dataSource.framework.get(req.params.frameworkId)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    put: (req, res) => {
      const frameworkId = req.params.frameworkId || req.body._id
      dataSource.framework.put(frameworkId, req.body)
      .then(results => {
        res.send(results)
        populateReferences(results.toJSON()).then(framework => {
          webhookService.send(framework)
        })
      })
      .catch(err => shared.stdErrorResponse(res, err))
    },

    create: (req, res) => {
      dataSource.framework.create(req.body)
      .then(results => {
        res.send(results)
        populateReferences(results.toJSON()).then(framework => {
          webhookService.send(framework)
        })
      })
      .catch(err => shared.stdErrorResponse(res, err))
    },

    remove: (req, res) => {
      dataSource.framework.remove(req.params.frameworkId)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    populateReferences: populateReferences
  }
}

exports = module.exports = frameworkController