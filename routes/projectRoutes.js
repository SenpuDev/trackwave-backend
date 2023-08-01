import express from 'express'
import { getProjects, getProject, createProject, editProject, deleteProject, addCollab, deleteCollab, searchCollab } from '../controllers/projectController.js'
import isAuth from '../middleware/isAuth.js'

const router = express.Router()

router.route('/').get(isAuth, getProjects).post(isAuth, createProject)
router.route('/:id').get(isAuth, getProject).put(isAuth, editProject).delete(isAuth, deleteProject)

router.post('/collabs', isAuth, searchCollab)
router.post('/collabs/:id', isAuth, addCollab)
router.post('/delete-collab/:id', isAuth, deleteCollab)

export default router
