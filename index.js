import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import cors from 'cors'

// Socket.io
import { Server } from 'socket.io'

const app = express()
app.use(express.json()) // Enable json read in request

dotenv.config() // Access to .env file

connectDB()

// Allowed connections with CORS
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Cors error, Connection not allowed:', origin))
    }
  }
}
app.use(cors(corsOptions))

// Routing
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

const server = app.listen(process.env.PORT, () => {
  // console.log(`Server running in port ${process.env.PORT} :)`)
})

// Socket.io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

io.on('connection', (socket) => {
  // Socket io events
  socket.on('open project', (projectId) => {
    socket.join(projectId) // Enter projectId "room"
  })

  socket.on('add task', (addedTask) => {
    socket.to(addedTask.project._id).emit('task added', addedTask)
  })
  socket.on('delete task', (deletedTask) => {
    socket.to(deletedTask.project._id).emit('task deleted', deletedTask)
  })
  socket.on('update task', (editedTask) => {
    console.log(editedTask)
    socket.to(editedTask.project._id).emit('task updated', editedTask)
  })
})
