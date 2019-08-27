const jwt = require('jsonwebtoken')
const md5 = require('md5')
const authorisedUsers = process.env.USERS || ''
const authController = () => {
  return {
    login: (req, res) => {
      const data = {
        user: req.body.user
      }
      
      const userhash = md5(`${req.body.user}:${req.body.pass}`)
      if (authorisedUsers.includes(userhash)) {
        const token = jwt.sign(data, process.env.AUTHSECRET, { expiresIn: '1h' })
        res.send({ token })
      } else {
        res.status(401)
        return res.json({ success: false, message: 'Failed to authenticate.' })
      }
    },
    ensureAuth: (req, res, next) => {
      const token = req.body.token || req.query.token || req.headers['authorization-token']

      jwt.verify(token, process.env.AUTHSECRET, function (err, decoded) {
        if (err) {
          res.status(403)
          return res.json({ success: false, message: 'Failed to authenticate token.' })
        } else {
          // if everything is good, save to request for use in other routes
          res.locals.auth = decoded
          next()
        }
      })
    }
  }
}

exports = module.exports = authController
