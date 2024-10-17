const { verify } = require('jsonwebtoken')
const User = require('../models/User')

const auth = () => {
  return async (req, res, next) => {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1]
        const decoded = verify(token, 'your_jwt_secret')

        req.user = await User.findById(decoded.id).select('-password')
        console.log('AUTH::', decoded, req.user)

        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized' })
        }

        next()
      } catch (err) {
        console.error(err)
        res.status(401).json({ message: 'Token verification failed' })
      }
    }

    if (!token) {
      res.status(401).json({ message: 'No token provided' })
    }
  }
}

module.exports = auth
