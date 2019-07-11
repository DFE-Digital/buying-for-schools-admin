const frameworkService = require('../services/frameworkService')()
const shared = require('../services/shared')

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
     frameworkService.get({ _id: req.params.frameworkId }).then(q => {
        if (!q) {
          return shared.stdErrorResponse(res, { code: 404 })  
        }
        res.send(q)
      }).catch(err => {
        shared.stdErrorResponse(res, err)
      })
    },

    put: (req, res) => {
      const frameworkId = req.params.frameworkId || req.body._id
      frameworkService.findUpdateAndSave({_id: frameworkId}, req.body).then(results => {
        res.send(results)
      }).catch(err => {
        shared.stdErrorResponse(res, err)
      })
    },

    create: (req, res) => {
      const data = {...req.body}
      // delete(data._id)
      // models.framework.create(data, (err, results) => {
      //   if (err) {
      //     return res.send(err)
      //   }
      //   res.send(results)
      // })
      frameworkService.create(req.body).then(result => {
        res.send(result)
      }).catch(err => {
        shared.stdErrorResponse(res, err)
      })
    },

    remove: (req, res) => {
      const frameworkId = req.params.frameworkId
      models.framework.deleteOne({ _id: frameworkId }, (err, results) => {
        res.send(results)
      })
    }
  }
}

exports = module.exports = frameworkController