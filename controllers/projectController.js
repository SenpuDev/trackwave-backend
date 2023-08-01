import ProjectModel from './../models/Project.js'
import UserModel from '../models/User.js'
import { validateId } from './../helpers/controllerValidations.js'
export const getProjects = async (req, res) => {
  const projects = await ProjectModel.find({
    $or: [{ collaborators: { $in: req.user } }, { createdBy: { $in: req.user } }]
  }).select('-tasks') // or req.user._id
  if (!projects) {
    return res.status(404).json({ msg: 'Not found' })
  }

  res.json(projects)
}

export const getProject = async (req, res) => {
  const { id } = req.params

  validateId(id, res)

  const project = await ProjectModel.findById(id).populate({ path: 'tasks', populate: { path: 'lastUpdateBy', select: 'name' } }).populate('collaborators', 'name email')

  if (!project) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (project.createdBy.toString() !== req.user._id.toString() && !project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
    return res.status(403).json({ msg: 'Not a valid action' })
  }

  res.json(project)
}

export const createProject = async (req, res) => {
  const project = new ProjectModel(req.body)
  project.createdBy = req.user._id

  try {
    const savedProject = await project.save()
    res.json({ msg: 'Project successfully added', savedProject })
  } catch (error) {
    return res.status(500).json({ msg: 'Error saving project, try again later' })
  }
}

export const editProject = async (req, res) => {
  const { id } = req.params

  validateId(id, res)

  const project = await ProjectModel.findById(id)

  if (!project) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not a valid action' })
  }

  project.name = req.body.name || project.name
  project.description = req.body.description || project.description
  project.deadLine = req.body.deadLine || project.deadLine
  project.client = req.body.client || project.client

  try {
    const updatedProject = await project.save()
    res.json({ msg: 'Project successfully Updated', updatedProject })
  } catch (error) {
    return res.status(500).json({ msg: 'Error editing project, try again later' })
  }
}
export const deleteProject = async (req, res) => {
  const { id } = req.params

  validateId(id, res)

  const project = await ProjectModel.findById(id)

  if (!project) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (project.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not a valid action' })
  }

  try {
    const deletedProject = await project.deleteOne()
    res.json({ msg: 'Project Deleted successfully', error: false, deletedProject })
  } catch (error) {
    return res.status(500).json({ msg: 'Error deleting project, try again later' })
  }
}

export const searchCollab = async (req, res) => {
  const { email } = req.body
  const userFound = await UserModel.findOne({ email })

  if (!userFound) {
    return res.status(404).json({ msg: 'User not found' })
  }

  res.json({ userFound })
}

export const addCollab = async (req, res) => {
  // Obtain the destination project
  const project = await ProjectModel.findById(req.params.id)

  if (!project) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (project.createdBy.toString() !== req.user._id.toString()) { // Are you the project creator?
    return res.status(404).json({ msg: 'Not valid action' })
  }

  // User as a project collab
  const { email } = req.body
  const userFound = await UserModel.findOne({ email })

  if (!userFound) {
    return res.status(404).json({ msg: 'User not found' })
  }

  if (project.createdBy.toString() === userFound._id.toString()) {
    return res.status(404).json({ msg: 'Project creator can not be added as a collaborator' })
  }

  if (project.collaborators.includes(userFound._id)) {
    return res.status(404).json({ msg: 'User already added in project' })
  }

  project.collaborators = [...project.collaborators, userFound._id]
  await project.save()
  res.json({ msg: 'Collaborator successfully added', error: false, addedCollab: userFound._id })
}
export const deleteCollab = async (req, res) => {
  // Obtain the destination project
  const project = await ProjectModel.findById(req.params.id)

  if (!project) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (project.createdBy.toString() !== req.user._id.toString()) { // Are you the project creator?
    return res.status(404).json({ msg: 'Not valid action' })
  }

  project.collaborators = project.collaborators.filter(
    collaborator => collaborator.toString() !== req.body.collaboratorId
  )
  await project.save()
  res.json({ msg: 'Collaborator successfully deleted', error: false, deletedCollaboratorId: req.body.collaboratorId })
}
