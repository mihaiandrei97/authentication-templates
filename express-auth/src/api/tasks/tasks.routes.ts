import { Router } from 'express'
import { requireUser } from '../../middlewares'
import * as TasksController from './tasks.controllers'

const router = Router()

router.get('/', requireUser, TasksController.findAll)

export default router
