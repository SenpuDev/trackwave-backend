import mongoose from 'mongoose'

export function validateId (id, res) {
  const validId = mongoose.Types.ObjectId.isValid(id)
  if (!validId) {
    return res.status(404).json({ msg: 'Not a valid id' })
  }
}
