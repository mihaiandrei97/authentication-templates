import { Router } from 'express'
import { requireUser } from '../../middlewares'
import * as UserController from './user.controllers'

const router = Router()

router.get('/me', requireUser, UserController.me)

export default router
