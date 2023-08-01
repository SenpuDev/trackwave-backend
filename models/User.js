import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  token: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  tymestamps: true
}
)

// User Model Methods:
// ".this" only works in function declaration cause we gonna call object.checkPassword (In regular functions ".this" represent the object that called the function)

// Hash password before save in DB - Automatically before saving
userSchema.pre('save', async function (next) {
  // Check if last password saved is equal as actual and skip the process
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Check if password is correct when login
userSchema.methods.checkPassword = async function (passwordIntroduced) {
  return await bcrypt.compare(passwordIntroduced, this.password)
}
const user = mongoose.model('user', userSchema)

export default user
