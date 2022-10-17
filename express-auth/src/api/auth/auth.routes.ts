import { Router } from 'express'
import { validateRequest } from '../../middlewares'
import * as AuthControllers from './auth.controllers'
import {
  loginQuerySchema,
  loginSchema,
  registerQuerySchema,
  registerSchema,
} from './auth.schema'

const router = Router()

router.post(
  '/register',
  validateRequest({ query: registerQuerySchema, body: registerSchema }),
  AuthControllers.register
)

router.post(
  '/login',
  validateRequest({ query: loginQuerySchema, body: loginSchema }),
  AuthControllers.login
)

export default router