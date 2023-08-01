import generateJWT from '../helpers/generateJWT.js'
import generateSignUpToken from '../helpers/generateSignUpToken.js'
import UserModel from '../models/User.js'
import { sendSignUpEmail, sendForgotPasswordEmail } from '../helpers/email.js'

const signUpUser = async (req, res) => {
  const { email } = req.body
  const duplicatedUser = await UserModel.findOne({ email })

  if (duplicatedUser) {
    return res.status(409).json({ msg: 'The user already exists' })
  }

  try {
    const user = new UserModel(req.body)
    user.token = generateSignUpToken()
    await user.save()

    sendSignUpEmail({
      email: user.email,
      name: user.name,
      token: user.token
    })

    res.json({ msg: 'User successfully registered. Please check your email to confirm your account.' })
  } catch (error) {
    res.status(500).json({ msg: 'Problem signing up the user, please try again later' })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  const user = await UserModel.findOne({ email })

  if (!user) {
    return res.status(404).json({ msg: 'User does not exists' })
  }

  if (!user.verified) {
    return res.status(403).json({ msg: 'User must be verified' })
  }

  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id)
    })
  } else {
    return res.status(403).json({ msg: 'Incorrect password' })
  }
}

const verifyUser = async (req, res) => {
  const { token } = req.params
  const user = await UserModel.findOne({ token })

  if (!user) {
    return res.status(403).json({ msg: 'Invalid Token' })
  }

  try {
    user.token = ''
    user.verified = true
    await user.save()
    res.json({ msg: 'User correctly verified' })
  } catch (error) {
    res.status(500).json({ msg: 'Can not verify user, please try again later' })
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  const user = await UserModel.findOne({ email })

  if (!user) {
    return res.status(404).json({ msg: 'User does not exists' })
  }

  try {
    user.token = generateSignUpToken()
    await user.save()

    sendForgotPasswordEmail({
      email: user.email,
      name: user.name,
      token: user.token
    })

    res.json({ msg: 'We have sent an email to your email address with the steps to recover your password.' })
  } catch (error) {
    res.status(500).json({ msg: 'Problem generating signup token, please try later' })
  }
}

export const checkResetPasswordToken = async (req, res) => {
  const { token } = req.params

  const validToken = await UserModel.findOne({ token })

  if (validToken) {
    res.json({ msg: 'Valid token' })
  } else {
    return res.status(404).json({ msg: 'Invalid Token' })
  }
}

export const newPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const user = await UserModel.findOne({ token })

  if (user) {
    user.password = password // Hashed automatically in model
    user.token = ''
    try {
      await user.save()
      res.json({ msg: 'New password successfully created' })
    } catch (error) {
      return res.status(500).json({ msg: 'Problem creating a new password, please try later' })
    }
  } else {
    return res.status(404).json({ msg: 'Invalid Token' })
  }
}

export const profile = async (req, res) => {
  const { user } = req
  res.json(user)
}

export { signUpUser, loginUser, verifyUser }
