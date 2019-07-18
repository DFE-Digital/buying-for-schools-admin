const shared = require('./shared')

const genericController = (dataSource, modelName) => { 
  const routeParamName = `${modelName}Id`
  return {
    list: (req, res) => {
      dataSource[modelName].list()
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    get: (req, res) => {
      dataSource[modelName].get(req.params[routeParamName])
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    put: (req, res) => {
      const id = req.params[routeParamName] || req.body._id
      dataSource[modelName].put(id, req.body)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    create: (req, res) => {
      dataSource[modelName].create(req.body)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    remove: (req, res) => {
      dataSource[modelName].remove(req.params[routeParamName])
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    }
  }
}

exports = module.exports = genericController