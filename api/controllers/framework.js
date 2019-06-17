const frameworkController = (models) => {
  return {
    list: (req, res) => {
      models.framework.find({}, (err, results) => {
        if (err) {
          return res.send(err)
        }

        res.send(results)
      })
    },

    get: (req, res) => {
      models.framework.findOne({ref: req.params.frameworkId}, (err, results) => {
        if (err) {
          return res.send(err)
        }

        res.send(results)
      })
    },

    put: (req, res) => {
      const frameworkId = req.params.frameworkId || req.body.ref
      models.framework.findOneAndUpdate({ref: frameworkId}, req.body, (err, results) => {
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
      models.framework.create(req.body, (err, results) => {
        if (err) {
          
          res.statusCode = 400
          return res.send({ err: err.code, msg: err.errmsg })
        }

        res.send(results)
      })
    },

    remove: (req, res) => {
      const frameworkId = req.params.frameworkId
      console.log('remove', frameworkId)
      models.framework.deleteOne({ ref: frameworkId }, (err, results) => {
        console.log(err, results)
        res.send(results)
      })
    }
  }
}

exports = module.exports = frameworkController