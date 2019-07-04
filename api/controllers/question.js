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
      questionService.get({ _id: req.params.questionId }).then(q => {
        
        if (!q) {
          return me.stdErrorResponse(res, { code: 404 })  
        }
        res.send(q)
      }).catch(err => {
        me.stdErrorResponse(res, err)
      })
    },

    put: (req, res) => {
      const questionId = req.params.questionId || req.body._id

      questionService.findUpdateAndSave({_id: questionId}, req.body).then(results => {
        res.send(results)
      }).catch(err => {
        me.stdErrorResponse(res, err)
      })
    },

    create: (req, res) => {
      delete(req.body._id)
      questionService.create(req.body).then(results => {
        res.send(results)
      }).catch(err => {
        me.stdErrorResponse(res, err)
      })
    },

    remove: (req, res) => {
      const questionId = req.params.questionId
      models.question.deleteOne({ _id: questionId }, (err, results) => {
        if (err) {
          return me.stdErrorResponse(res, err)
        }

        if (results.deletedCount === 0) {
          return me.stdErrorResponse(res, { code: 404 })
        }
        res.send({ success: true })
      })
    },

    stdErrorResponse: (res, err) => {
      console.log(err)
      res.statusCode = 400
      const response = {
        success: false
      }

      if (err.code === 404) {
        res.statusCode = 404
        response.err = 404
        response.msg = 'Document not found'
        return res.send(response)
      }
      if (err.code === 11000) {
        response.err = 'validation'
        response.msg = 'Validation errors'
        response.errors = [{ id: 'ref', msg: 'Reference must be unique'}]
        return res.send(response)
      }

      if (err.errors) {
        const errorMessages = Object.keys(err.errors).map(k => {
          return { id: k, msg: err.errors[k].message }
        })
        response.err = 'validation'
        response.msg = 'Validation errors'
        response.errors = errorMessages
        return res.send(response)
      }

      if (err.kind === 'ObjectId' && err.name === 'CastError') {
        response.err = 'invalid-object-id'
        response.msg = 'Invalid object ID'
        return res.send(response)
      }



      // console.log(err)
      return res.send(response)
    }
  }
  return me
}

exports = module.exports = questionController