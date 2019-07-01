const categoryController = (models) => {
  return {
    list: (req, res) => {
      models.category.find({}, (err, results) => {
        if (err) {
          return res.send(err)
        }
        res.send(results)
      })
    },

    get: (req, res) => {
      models.category.findOne({_id: req.params.categoryId}, (err, results) => {
        if (err) {
          return res.send(err)
        }
        res.send(results)
      })
    },

    put: (req, res) => {
      const categoryId = req.params.categoryId
      models.category.findOneAndUpdate({_id: categoryId}, req.body, (err, results) => {
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
      models.category.create(req.body, (err, results) => {
        if (err) {
          res.statusCode = 400
          return res.send({ err: err.code, msg: err.errmsg })
        }
        res.send(results)
      })
    },

    remove: (req, res) => {
      const categoryId = req.params.categoryId
      models.category.deleteOne({ _id: categoryId }, (err, results) => {
        res.send(results)
      })
    }
  }
}

exports = module.exports = categoryController