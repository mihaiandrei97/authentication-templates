import express from 'express'
import MessageResponse from '../interfaces/MessageResponse'
import authRoutes from './auth/auth.routes'
import userRoutes from './user/user.routes'
const router = express.Router()

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  })
})

router.use('/auth', authRoutes)
router.use('/user', userRoutes)

export default router
