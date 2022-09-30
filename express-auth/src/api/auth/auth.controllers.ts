import { Response, Request, NextFunction } from 'express'

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.json('todo')
  } catch (error) {
    next(error)
  }
}
