import * as jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { config } from './config'

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(
  user: User,
  expiresIn: string | number = config.jwt_access_lifetime
) {
  return jwt.sign({ userId: user.id }, config.jwt_access_secret, {
    expiresIn,
  })
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
export function generateRefreshToken(
  user: User,
  jti: string,
  expiresIn: string | number = config.jwt_refresh_lifetime
) {
  return jwt.sign(
    {
      userId: user.id,
      jti,
    },
    config.jwt_refresh_secret,
    {
      expiresIn,
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

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, config.jwt_refresh_secret)
  } catch (error) {
    throw error
  }
}
