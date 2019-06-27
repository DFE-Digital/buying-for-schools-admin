const questionService = require('../services/questionService')()
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
      questionService.getByRef(req.params.questionId).then(q => {
        res.send(q)
      }).catch(err => {
        return res.send(err)
      })
    },

    put: (req, res) => {
      const questionId = req.params.questionId || req.body._id

      questionService.findUpdateAndSave({_id: questionId}, req.body).then(results => {
        res.send(results)
      }).catch(err => {
        res.statusCode = 400
        res.send(me.mongoErrorResponse(err))
      })
    },

    create: (req, res) => {
      questionService.create(req.body).then(results => {
        res.send(results)
      }).catch(err => {
        res.statusCode = 400
        res.send(me.mongoErrorResponse(err))
      })
    },

    remove: (req, res) => {
      const questionId = req.params.questionId
      models.question.deleteOne({ _id: questionId }, (err, results) => {
        res.send(results)
      })
    },

    mongoErrorResponse: (err) => {
      const response = {
        success: false
      }
      if (err.code === 11000) {
        response.err = 'validation'
        response.msg = 'Validation errors'
        response.errors = [{ id: 'ref', msg: 'Reference must be unique'}]
        return response
      }

      if (err.errors) {
        const errorMessages = Object.keys(err.errors).map(k => {
          return { id: k, msg: err.errors[k].message }
        })
        response.err = 'validation'
        response.msg = 'Validation errors'
        response.errors = errorMessages
        return response
      }

      return response
    }
  }
  return me
}

exports = module.exports = questionController