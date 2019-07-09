const shared = require('../services/shared')

const genericController = (model) => {
  const modelName = model.modelName
  return {
    list: (req, res) => {
      model.find({}, (err, results) => {
        if (err) {
          return shared.stdErrorResponse(res, err)
        }
        res.send(results)
      })
    },

    get: (req, res) => {
      model.findOne({_id: req.params[`${modelName}Id`]}, (err, results) => {
        if (err) {
          return shared.stdErrorResponse(res, err)
        }
        res.send(results)
      })
    },

    put: (req, res) => {
      const documentId = req.params[`${modelName}Id`]
      model.findOneAndUpdate({_id: documentId}, req.body, (err, results) => {
        if (err) {
          return shared.stdErrorResponse(res, err)
        }
        if (!results) {
          return res.send({ success: true })
        }
        res.send(results)
      })
    },

    create: (req, res) => {
      const data = req.body
      delete(data._id)
      model.create(data, (err, results) => {
        if (err) {
          return shared.stdErrorResponse(res, err)
        }
        res.send(results)
      })
    },

    remove: (req, res) => {
      const documentId = req.params[`${modelName}Id`]
      model.deleteOne({ _id: documentId }, (err, results) => {
        res.send(results)
      })
    }
  }
}

exports = module.exports = genericController