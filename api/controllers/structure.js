const shared = require('./shared')



const structureController = (dataSource) => {
  const me = {
    list: (req, res) => {
      dataSource.structure.list()
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    }
  }

  return me
}

exports = module.exports = structureController