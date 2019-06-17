const questionService = require('../services/questionService')()

const questionHierarchyController = models => {

  return {
    get: (req, res) => {
      questionService.getHierarchy(req.params.questionId).then(result => {
        res.send(result)
      }).catch(err => {
        res.send(err)
      })
    }
  }
}

exports = module.exports = questionHierarchyController