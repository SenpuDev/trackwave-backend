import jwt from 'jsonwebtoken'
import UserModel from './../models/User.js'

const isAuth = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1] // [Bearer] [os287$JSj2s]
      const decoded = await jwt.verify(token, process.env.JWT_SECRET)
      req.user = await UserModel.findById(decoded.userId).select('-password -verified -token -__v -createdAt -updatedAt')
      return next()
    } catch (error) {
      return res.status(404).json({ msg: 'Invalid token' })
    }
  }

  if (!token) {
    const error = new Error('Token not found')
    return res.status(401).json({ msg: error.message })
  }

  next() // Next Fn in router if all is correct
}

export default isAuth
