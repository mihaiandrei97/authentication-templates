import { User } from '@prisma/client'
import { Response, Request, NextFunction } from 'express'
import { db } from '../../db'
import { RegisterInput } from './auth.schema'

export async function register(
  req: Request<{}, RegisterInput, RegisterInput>,
  res: Response<User>,
  next: NextFunction
) {
  try {
    const user = await db.user.create({ data: req.body })
    res.json(user)
  } catch (error) {
    next(error)
  }
}
