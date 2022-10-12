import { Router } from 'express'
import { validateRequest } from '../../middlewares'
import * as AuthControllers from './auth.controllers'
import { registerQuerySchema, registerSchema } from './auth.schema'

const router = Router()

router.post(
  '/register',
  validateRequest({ query: registerQuerySchema, body: registerSchema }),
  AuthControllers.register
)

export default router
