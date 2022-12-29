import { Response } from 'express'

export function sendRefreshToken(res: Response, token: string) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: true,
    path: '/api/v1/auth',
  })
}
