import request from 'supertest'
import app from '../../app'
import { db } from '../../db'
import * as bcrypt from 'bcrypt'
import { generateRefreshToken } from '../../utils/jwt'
import cuid from 'cuid'
import { hashToken } from '../../utils/hashToken'
import { globalUserCredentials } from '../../globalSetup'

describe('POST /api/v1/auth/register', () => {
  it('responds with an error if payload is missing', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(400)
  })

  it('responds with an error if payload email is missing ', async () => {
    const payload = {
      password: 'Test1@123',
    }

    const response = await request(app)
      .post('/api/v1/auth/register')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(payload)

    expect(response.statusCode).toBe(400)
  })

  it('responds with an error if password is missing ', async () => {
    const payload = {
      email: 'mihai@mihai.com',
    }
    const response = await request(app)
      .post('/api/v1/auth/register')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(payload)

    expect(response.statusCode).toBe(400)
  })

  it('responds with an access_token and refresh_token', async () => {
    const payload = {
      email: 'mihai@mihai.com',
      password: 'Test1@123',
    }

    const response = await request(app)
      .post('/api/v1/auth/register')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(payload)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
    expect(response.body.refresh_token).toEqual(expect.any(String))
  })

  it('responds with an access_token and refresh_token in cookie', async () => {
    const payload = {
      email: 'mihai2@mihai2.com',
      password: 'Test1@123',
    }

    const response = await request(app)
      .post('/api/v1/auth/register?refreshTokenInCookie=true')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(payload)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
    expect(Array.isArray(response.headers['set-cookie'])).toBe(true)
    expect(response.headers['set-cookie'][0]).toContain('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
  })
})

describe('POST /api/v1/auth/login', () => {
  it('responds with an error if payload is missing', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(400)
  })

  it('responds with an error if payload email is missing ', async () => {
    const payload = {
      password: 'Test1@123',
    }

    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(payload)

    expect(response.statusCode).toBe(400)
  })

  it('responds with an error if password is missing ', async () => {
    const payload = {
      email: 'mihai@mihai.com',
    }
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(payload)

    expect(response.statusCode).toBe(400)
  })

  it('responds with unauthorized if user is missing from db', async () => {
    const payload = {
      email: 'test@test.com',
      password: 'Test1@123',
    }
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(payload)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Invalid login credentials.')
  })

  it('responds with unauthorized if password is wrong', async () => {
    const payload = {
      ...globalUserCredentials,
      password: 'wrongPassw0rd',
    }
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(payload)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Invalid login credentials.')
  })

  it('responds with an access_token and refresh_token', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send({
        email: globalUserCredentials.email,
        password: globalUserCredentials.password,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
    expect(response.body.refresh_token).toEqual(expect.any(String))
  })

  it('responds with an access_token and refresh_token in cookie', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login?refreshTokenInCookie=true')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send({
        email: globalUserCredentials.email,
        password: globalUserCredentials.password,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
    expect(Array.isArray(response.headers['set-cookie'])).toBe(true)
    expect(response.headers['set-cookie'][0]).toContain('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
  })
})

describe('POST /api/v1/auth/refreshToken', () => {
  const userCredentials = {
    email: 'mihai@refresh.com',
    password: 'Test1@123',
  }

  let expiredRefreshToken = ''
  let validRefreshToken = ''
  let refreshTokenNotPresentInDb = ''

  beforeAll(async () => {
    const user = await db.user.create({
      data: {
        email: userCredentials.email,
        password: bcrypt.hashSync(userCredentials.password, 12),
      },
    })

    expiredRefreshToken = generateRefreshToken(
      { userId: user.id, jti: cuid() },
      '1s'
    )

    const jti = cuid()
    validRefreshToken = generateRefreshToken({ userId: user.id, jti }, '5m')
    refreshTokenNotPresentInDb = generateRefreshToken(
      { userId: user.id, jti: cuid() },
      '5m'
    )

    await db.refreshToken.create({
      data: {
        id: jti,
        hashedToken: hashToken(validRefreshToken),
        userId: user.id,
      },
    })
  })

  afterAll(async () => {
    await db.user.delete({
      where: {
        email: userCredentials.email,
      },
    })
  })

  it('responds with error if refresh_token is missing ( body case )', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refreshToken')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Missing refresh token.')
  })

  it('responds with error if refresh_token is missing ( cookie case )', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refreshToken')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Missing refresh token.')
  })

  it('responds with Unauthorized if token is expired ( body case ) ', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const response = await request(app)
      .post('/api/v1/auth/refreshToken')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send({ refresh_token: expiredRefreshToken })

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('jwt expired')
  })

  it('responds with Unauthorized if token is expired ( cookie case ) ', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const response = await request(app)
      .post('/api/v1/auth/refreshToken')
      .set('Accept', 'application/json')
      .set('Cookie', [`refresh_token=${expiredRefreshToken}`])
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('jwt expired')
  })
  it('responds with Unauthorized if token is not present in db ( body case ) ', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refreshToken')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send({ refresh_token: '1231231a' })

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('jwt malformed')
  })

  it('responds with Unauthorized if token is not present in db ( cookie case ) ', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refreshToken')
      .set('Accept', 'application/json')
      .set('Cookie', [`refresh_token=${refreshTokenNotPresentInDb}`])
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Unauthorized')
  })

  it('responds with an access_token and refresh_token ( body case )', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refreshToken')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send({ refresh_token: validRefreshToken })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
    expect(response.body.refresh_token).toEqual(expect.any(String))
    validRefreshToken = response.body.refresh_token
  })

  it('responds with an access_token and refresh_token ( cookie case )', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refreshToken')
      .set('Accept', 'application/json')
      .set('Cookie', [`refresh_token=${validRefreshToken}`])
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
    expect(response.body).toHaveProperty('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
    expect(response.body.refresh_token).toEqual(expect.any(String))
    validRefreshToken = response.body.refresh_token
  })
  it('responds with an access_token and refresh_token in cookie', async () => {
    const response = await request(app)
      .post('/api/v1/auth/refreshToken?refreshTokenInCookie=true')
      .set('Accept', 'application/json')
      .set('Cookie', [`refresh_token=${validRefreshToken}`])
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
    expect(Array.isArray(response.headers['set-cookie'])).toBe(true)
    expect(response.headers['set-cookie'][0]).toContain('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
  })
})
