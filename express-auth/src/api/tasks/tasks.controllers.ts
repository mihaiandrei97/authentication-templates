import { Response, Request, NextFunction } from 'express'

export async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
}
