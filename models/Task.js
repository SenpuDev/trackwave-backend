import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Under Review', 'Completed'],
    default: 'Pending'
  },
  deadLine: {
    type: Date,
    required: true,
    default: Date.now()
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project'
  },
  lastUpdateBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
}, {
  timestamps: true
})

const Task = mongoose.model('task', taskSchema)

export default Task
