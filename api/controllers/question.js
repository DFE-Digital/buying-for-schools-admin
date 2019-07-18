
const shared = require('./shared')

const questionController = (dataSource) => {
  const me = {
    
    list: (req, res) => {
      dataSource.question.list()
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    get: (req, res) => {
      dataSource.question.get(req.params.questionId)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    put: (req, res) => {
      const questionId = req.params.questionId || req.body._id
      dataSource.question.put(questionId, req.body)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    remove: (req, res) => {
      dataSource.question.remove(req.params.questionId)
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    },

    create: (req, res) => {
      dataSource.question.create(req.body)
      .then(results => dataSource.question.linkToOption(results,req.params.questionId, req.params.optionId))
      .then(results => res.send(results))
      .catch(err => shared.stdErrorResponse(res, err))
    }
  }
  return me
}

exports = module.exports = questionController