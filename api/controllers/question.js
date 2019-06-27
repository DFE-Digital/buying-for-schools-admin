const questionService = require('../services/questionService')()
const validateQuestionRef = RegExp(/^[a-z-]*$/)

const questionController = (models) => {
  const me = {
    // validation: (q) => {
    //   const errors = []
    //   // console.log(`validation ref: "${q.ref}"`, validateQuestionRef.test(q.ref))
    //   if(!q.ref || !validateQuestionRef.test(q.ref)) {
    //     errors.push({ id: 'ref', msg: 'A reference must be defined, short, no spaces and unique'})
    //   }

    //   if(!q.title) {
    //     errors.push({id: 'title', msg: 'Title cannot be blank this is the question text.'})
    //   }
    //   return errors
    // },

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
      // const errors = me.validation(req.body)
      // if (errors.length) {
      //   res.statusCode = 400
      //   return res.send({ err: 'validation', msg: 'Validation errors', errors })
      // }

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

      // const errors = me.validation(req.body)
      // if (errors.length) {
      //   res.statusCode = 400
      //   return res.send({ err: 'validation', msg: 'Validation errors', errors })
      // }

      let jsonOutput = {}

      questionService.create(req.body).then(newQuestion => {
        jsonOutput = newQuestion
        if (parent && parent.id) {
          return questionService.get({ _id: parent.id })
        }
        return false
      }).catch(errors => {
        console.log('CAUGHT 1 err', errors)
        res.statusCode = 400
        res.send({ err: 'validation', msg: 'Validation errors', errors })
        // return false
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
        console.log('CAUGHT 2 err', err)
        res.statusCode = 400
        res.send(err)
      })
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