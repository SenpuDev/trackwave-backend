import express from 'express'
import { signUpUser, loginUser, verifyUser, forgotPassword, checkResetPasswordToken, newPassword, profile } from '../controllers/userController.js'
import isAuth from '../middleware/isAuth.js'

const router = express.Router()

router.post('/', signUpUser)
router.post('/login', loginUser)
router.get('/verify/:token', verifyUser) // :whatever or :token means any value, express generate a param with named variable
router.post('/forgot-password', forgotPassword) // Email send to reset pass

router.get('/reset-password/:token', checkResetPasswordToken)
router.post('/reset-password/:token', newPassword)
// Same as two up lines -> router.route('/reset-password/:token').get(checkResetPasswordToken).post(newPassword)

router.get('/profile', isAuth, profile)

export default router
