const questionService = require('../services/questionService')()


const questionController = (models) => {
  const me = {
    validation: (q) => {
      const errors = []
      if(!q.ref) {
        errors.push({ id: 'ref', msg: 'A reference must be defined, short, no spaces and unique'})
      }
      if(!q.title) {
        errors.push({id: 'title', msg: 'Title cannot be blank this is the question text.'})
      }
      return errors
    },

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
      const errors = me.validation(req.body)
      if (errors.length) {
        res.statusCode = 400
        return res.send({ err: 'validation', msg: 'Validation errors', errors })
      }

      questionService.findOneAndUpdate({_id: questionId}, req.body).then(results => {
        res.send(results)
      }).catch(err => {
        res.statusCode = 400
        res.send(err)
      })
    },

    create: (req, res) => {
      const parent = req.body._parent
      delete(req.body._parent)
      delete(req.body._id)

      console.log(parent)
      console.log(req.body)
      // res.send({ parent, body: req.body })
      // return 

      let jsonOutput = {}

      questionService.create(req.body).then(newQuestion => {
        jsonOutput = newQuestion
        if (parent && parent.id) {
          return questionService.get({ _id: parent.id })
          // return questionService.findOneAndUpdate(
          //   { _id: parent.id }, 
          //   { $set: { 'options.$[optionIndex].next': newQuestion._id } }, 
          //   { arrayFilters: [ { optionIndex: parent.optionIndex } ] }
          // )
        }
        return false
      }).then(theParent => {
        if (theParent) {
          const updateData = theParent.toObject()
          updateData.options[parent.optionIndex].next = jsonOutput._id
          return questionService.findOneAndUpdate({_id: parent.id}, updateData)
        }
        return false
        // res.send(updatedParent)
      }).then(updatedParent => {
        res.send(jsonOutput)
      }).catch(err => {
        res.statusCode = 400
        res.send(err)
      })

      // models.question.create(req.body, (err, results) => {
      //   if (err) {
          
      //     res.statusCode = 400
      //     return res.send({ err: err.code, msg: err.errmsg })
      //   }

      //   res.send(results)
      // })
    },

    remove: (req, res) => {
      const questionId = req.params.questionId
      models.question.deleteOne({ _id: questionId }, (err, results) => {
        res.send(results)
      })
    }
  }
  return me
}

exports = module.exports = questionController