import { Router } from 'express'
import { validateRequest } from '../../middlewares'
import * as AuthControllers from './auth.controllers'
import { registerSchema } from './auth.schema'

const router = Router()

router.post(
  '/register',
  validateRequest({ body: registerSchema }),
  AuthControllers.register
)

export default router
