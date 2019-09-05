const jwt = require('jsonwebtoken')
const md5 = require('md5')
const authorisedUsers = (process.env.USERS || '').toLowerCase()
const authController = () => {
  return {
    login: (req, res) => {
      // if (process.env.AUTHDISABLED === 'DISABLED') {
      //   return res.send({token: 'abcdefghijklmnopqrstuvwxyz'})
      // }
      const data = {
        user: req.body.user
      }
      
      const userhash = md5(`${req.body.user}:${req.body.pass}`)
      if (authorisedUsers.includes(userhash.toLowerCase())) {
        const token = jwt.sign(data, process.env.AUTHSECRET, { expiresIn: '2h' })
        res.send({ token })
      } else {
        console.log(`Failed to authenticate:\n${req.body.user}\n${userhash}\n${authorisedUsers}\n` )
        res.status(401)
        return res.json({ success: false, message: 'Failed to authenticate.' })
      }
    },
    ensureAuth: (req, res, next) => {
      if (process.env.AUTHDISABLED === 'DISABLED') {
        // for testing only
        // return next()
      }

      const token = req.body.token || req.query.token || req.headers['authorization-token']

      jwt.verify(token, process.env.AUTHSECRET, function (err, decoded) {
        if (err) {
          res.status(403)
          console.log('jwt error', err)
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
