import request from 'supertest'
import app from '../../app'
import { db } from '../../db'
import * as bcrypt from 'bcrypt'
import { generateAccessToken } from '../../utils/jwt'
import { User } from '@prisma/client'
describe('GET /api/v1/user/me', () => {
  const userCredentials = {
    email: 'mihai@me.com',
    password: 'Test1@123',
  }

  let validAccessToken = ''
  let user: User
  beforeAll(async () => {
    user = await db.user.create({
      data: {
        email: userCredentials.email,
        password: bcrypt.hashSync(userCredentials.password, 12),
      },
    })

    validAccessToken = generateAccessToken(user, '5m')
  })

  afterAll(async () => {
    await db.user.delete({
      where: {
        email: userCredentials.email,
      },
    })
  })
  it('responds with an error if token is missing', async () => {
    const response = await request(app)
      .get('/api/v1/user/me')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(401)
  })

  it('responds with id and email', async () => {
    const response = await request(app)
      .get('/api/v1/user/me')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('email')
    expect(response.body.id).toBe(user.id)
    expect(response.body.email).toBe(user.email)
  })
})
