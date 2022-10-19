import * as jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { config } from './config'

export interface IAccessTokenPayload {
  userId: User['id']
}
export interface IRefreshTokenPayload {
  userId: User['id']
  jti: string
}

// Usually I keep the token between 5 minutes - 15 minutes
export function generateAccessToken(
  payload: IAccessTokenPayload,
  expiresIn: string | number = config.jwt_access_lifetime
) {
  return jwt.sign(payload, config.jwt_access_secret, {
    expiresIn,
  })
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
export function generateRefreshToken(
  payload: IRefreshTokenPayload,
  expiresIn: string | number = config.jwt_refresh_lifetime
) {
  return jwt.sign(payload, config.jwt_refresh_secret, {
    expiresIn,
  })
}

export function generateTokens(user: User, jti: string) {
  const accessTokenPayload: IAccessTokenPayload = {
    userId: user.id,
  }
  const refreshTokenPayload: IRefreshTokenPayload = {
    jti: jti,
    userId: user.id,
  }
  const accessToken = generateAccessToken(accessTokenPayload)
  const refreshToken = generateRefreshToken(refreshTokenPayload)

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

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, config.jwt_access_secret)
  } catch (error) {
    throw error
  }
}
