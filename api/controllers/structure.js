const shared = require('./shared')

const structureController = (dataSource) => {
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
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },
    remove: (req, res) => {
      dataSource.structure.remove(req.params.structureId)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    }
  }

  return me
}

exports = module.exports = structureController