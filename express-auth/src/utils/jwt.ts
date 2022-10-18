import * as jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { config } from './config'

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(user: User) {
  return jwt.sign({ userId: user.id }, config.jwt_access_secret, {
    expiresIn: config.jwt_access_lifetime,
  })
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
export function generateRefreshToken(user: User, jti: string) {
  return jwt.sign(
    {
      userId: user.id,
      jti,
    },
    config.jwt_refresh_secret,
    {
      expiresIn: config.jwt_refresh_lifetime,
    }
  )
}

export function generateTokens(user: User, jti: string) {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user, jti)

  return {
    accessToken,
    refreshToken,
  }
}
