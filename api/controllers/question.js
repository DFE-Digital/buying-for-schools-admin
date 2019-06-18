const questionService = require('../services/questionService')()

const questionController = (models) => {
  return {
    list: (req, res) => {
      models.question.find({}, (err, results) => {
        if (err) {
          return res.send(err)
        }
        console.log(results)
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
      const questionId = req.params.questionId || req.body.ref
      models.question.findOneAndUpdate({ref: questionId}, req.body, (err, results) => {
        if (err) {
          
          res.statusCode = 400
          return res.send({ err: err.code, msg: err.errmsg })
        }
        if (!results) {
          return res.send({ success: true })
        }

        res.send(results)
      })
    },

    create: (req, res) => {
      models.question.create(req.body, (err, results) => {
        if (err) {
          
          res.statusCode = 400
          return res.send({ err: err.code, msg: err.errmsg })
        }

        res.send(results)
      })
    },

    remove: (req, res) => {
      const questionId = req.params.questionId
      console.log('remove', questionId)
      models.question.deleteOne({ ref: questionId }, (err, results) => {
        console.log(err, results)
        res.send(results)
      })
    }
  }
}

exports = module.exports = questionController