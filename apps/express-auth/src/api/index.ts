import express from 'express'
import MessageResponse from '../interfaces/MessageResponse'
import authRoutes from './auth/auth.routes'
import usersRoutes from './users/users.routes'
import tasksRoutes from './tasks/tasks.routes'

const router = express.Router()

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  })
})

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/tasks', tasksRoutes)

export default router
