
const shared = require('./shared')

const frameworkController = (dataSource) => { 
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
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    create: (req, res) => {
      dataSource.framework.create(req.body)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    remove: (req, res) => {
      dataSource.framework.remove(req.params.frameworkId)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    }
  }
}

exports = module.exports = frameworkController