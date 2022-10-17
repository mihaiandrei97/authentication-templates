import cuid from 'cuid'
import { Response, Request, NextFunction } from 'express'
import { TokensResponseInterface } from '../../interfaces/TokensResponse'
import { generateTokens } from '../../utils/jwt'
import { sendRefreshToken } from '../../utils/sendRefreshToken'
import {
  createUserByEmailAndPassword,
  findUserByEmail,
} from '../user/user.services'
import {
  LoginInput,
  LoginQuerySchema,
  RegisterInput,
  RegisterQuerySchema,
} from './auth.schema'
import { addRefreshTokenToWhitelist } from './auth.services'
import * as bcrypt from 'bcrypt'

export async function register(
  req: Request<{}, TokensResponseInterface, RegisterInput, RegisterQuerySchema>,
  res: Response<TokensResponseInterface>,
  next: NextFunction
) {
  try {
    const { email, password } = req.body
    const { refreshTokenInCookie } = req.query

    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      res.status(400)
      throw new Error('Email already in use.')
    }

    const user = await createUserByEmailAndPassword({ email, password })

    const jti = cuid()
    const { accessToken, refreshToken } = generateTokens(user, jti)

    await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id })

    if (refreshTokenInCookie === 'true') {
      sendRefreshToken(res, refreshToken)
      res.json({
        access_token: accessToken,
      })
    } else {
      res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    }
  } catch (error) {
    next(error)
  }
}

export async function login(
  req: Request<{}, TokensResponseInterface, LoginInput, LoginQuerySchema>,
  res: Response<TokensResponseInterface>,
  next: NextFunction
) {
  try {
    const { email, password } = req.body
    const { refreshTokenInCookie } = req.query

    const existingUser = await findUserByEmail(email)

    if (!existingUser) {
      res.status(401)
      throw new Error('Invalid login credentials.')
    }

    const validPassword = await bcrypt.compare(password, existingUser.password)
    if (!validPassword) {
      res.status(401)
      throw new Error('Invalid login credentials.')
    }

    const jti = cuid()
    const { accessToken, refreshToken } = generateTokens(existingUser, jti)

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
    })

    if (refreshTokenInCookie === 'true') {
      sendRefreshToken(res, refreshToken)
      res.json({
        access_token: accessToken,
      })
    } else {
      res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
    }
  } catch (error) {
    next(error)
  }
}
