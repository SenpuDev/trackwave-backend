import ProjectModel from '../models/Project.js'
import TaskModel from '../models/Task.js'
import { validateId } from './../helpers/controllerValidations.js'

export const addTask = async (req, res) => {
  const { project } = req.body
  const existProject = await ProjectModel.findById(project)

  if (!existProject) {
    return res.status(404).json({ msg: 'Project does not exist' })
  }

  if (existProject.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not a valid action' })
  }

  try {
    const newTask = await new TaskModel(req.body)

    // Save New task
    newTask.lastUpdateBy = req.user._id
    await newTask.save()
    // Update project tasks
    existProject.tasks = [...existProject.tasks, newTask._id]
    await existProject.save()

    // Get lastUpdated name and email of new task
    const addedTask = await TaskModel.findById(newTask._id).populate('project').populate('lastUpdateBy', 'name email')

    res.json({ msg: 'Task successfully added', error: false, addedTask })
  } catch (error) {
    res.status(401).json({ msg: 'Error saving task' })
  }
}

export const getTask = async (req, res) => {
  const { id } = req.params

  validateId(id, res)

  const task = await TaskModel.findById(id).populate('project') // Access to ref: 'project' and get project information too (Like a JOIN in SQL)

  if (!task) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (task.project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not a valid action' })
  }

  return res.json(task)
}

export const updateTask = async (req, res) => {
  const { id } = req.params

  validateId(id, res)

  const task = await TaskModel.findById(id).populate('project') // Access to ref: 'project' and get project information too (Like a JOIN in SQL)

  if (!task) {
    return res.status(404).json({ msg: 'Not found' })
  }

  task.name = req.body.name || task.name
  task.description = req.body.description || task.description
  task.priority = req.body.priority || task.priority
  task.deadLine = req.body.deadLine || task.deadLine
  task.status = req.body.status || task.status
  task.lastUpdateBy = req.user._id

  try {
    await task.save()
    const editedTask = await TaskModel.findById(id).populate('project').populate('lastUpdateBy', 'name email')
    return res.json({ msg: 'Task successfully updated', error: false, editedTask })
  } catch (error) {
    return res.status(500).json({ msg: 'Error saving project, try again later' })
  }
}

export const deleteTask = async (req, res) => {
  const { id } = req.params

  validateId(id, res)

  const task = await TaskModel.findById(id).populate('project').populate('lastUpdateBy', 'name email') // Access to ref: 'project' and get

  if (!task) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (task.project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not a valid action' })
  }

  try {
    const project = await ProjectModel.findById(task.project)
    project.tasks.pull(task._id)
    const promises = await Promise.allSettled([await project.save(), await task.deleteOne()])
    return res.json({ msg: 'Task successfully Deleted', error: false, deletedTask: promises[1].value })
  } catch (error) {
    return res.status(500).json({ msg: 'Error deleting the task, try again later' })
  }
}
