import mongoose from 'mongoose'

const projectsSchema = mongoose.Schema({
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
  deadLine: {
    type: Date,
    default: Date.now()
  },
  client: {
    type: String,
    trim: true,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task'
    }
  ],
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ]

}, {
  tymestamps: true
})

const Project = mongoose.model('project', projectsSchema)

export default Project
