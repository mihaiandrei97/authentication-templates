import { Router } from 'express'
import { paramsWithIdSchema } from '../../interfaces/ParamsWithId'
import { requireUser, validateRequest } from '../../middlewares'
import * as TasksController from './tasks.controllers'
import { taskSchema } from './tasks.schemas'

const router = Router()

router.get('/', requireUser, TasksController.findAll)
router.post(
  '/',
  [requireUser, validateRequest({ body: taskSchema })],
  TasksController.createOne
)
router.get(
  '/:id',
  [requireUser, validateRequest({ params: paramsWithIdSchema })],
  TasksController.findOne
)
router.put(
  '/:id',
  [
    requireUser,
    validateRequest({ params: paramsWithIdSchema, body: taskSchema }),
  ],
  TasksController.updateOne
)

export default router
