const questionService = require('../services/questionService')()
const shared = require('../services/shared')
const validateQuestionRef = RegExp(/^[a-z-]*$/)

const questionController = (models) => {
  const me = {
    
    list: (req, res) => {
      models.question.find({}, (err, results) => {
        if (err) {
          return res.send(err)
        }
        res.send(results)
      })
    },

    get: (req, res) => {
      questionService.get({ _id: req.params.questionId }).then(q => {
        
        if (!q) {
          return shared.stdErrorResponse(res, { code: 404 })  
        }
        res.send(q)
      }).catch(err => {
        shared.stdErrorResponse(res, err)
      })
    },

    put: (req, res) => {
      const questionId = req.params.questionId || req.body._id
      questionService.findUpdateAndSave({_id: questionId}, req.body).then(results => {
        res.send(results)
      }).catch(err => {
        shared.stdErrorResponse(res, err)
      })
    },

    create: (req, res) => {
      delete(req.body._id)
      let newData
      questionService.create(req.body).then(results => {
        newData = results
        if (req.params.questionId && req.params.optionId) {
          return questionService.linkQuestionToOption(results._id, req.params.questionId, req.params.optionId)
        }
        return results
      }).then(results => {
        res.send(newData)
      }).catch(err => {
        shared.stdErrorResponse(res, err)
      })
    },

    remove: (req, res) => {
      const questionId = req.params.questionId
      models.question.deleteOne({ _id: questionId }, (err, results) => {
        if (err) {
          return shared.stdErrorResponse(res, err)
        }

        if (results.deletedCount === 0) {
          return shared.stdErrorResponse(res, { code: 404 })
        }
        res.send({ success: true })
      })
    }

    
  }
  return me
}

exports = module.exports = questionController