import { Response, Request, NextFunction } from 'express'
import { ParsedToken } from '../../../typings/token'
import { findUserById } from './user.services'

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedToken: ParsedToken = req.user
    const user = await findUserById(parsedToken.userId)

    if (!user) {
      res.status(404)
      throw new Error('User not found.')
    }

    res.json({
      id: user.id,
      email: user.email,
    })
  } catch (error) {
    next(error)
  }
}
