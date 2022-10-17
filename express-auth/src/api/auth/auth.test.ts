import request from 'supertest'
import app from '../../app'
import { db } from '../../db'
import * as bcrypt from 'bcrypt'

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
    expect(Array.isArray(response.headers['set-cookie']))
    expect(response.headers['set-cookie'][0]).toContain('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
  })
})

describe('POST /api/v1/auth/login', () => {
  const userCredentials = {
    email: 'mihai@login.com',
    password: 'Test1@123',
  }

  beforeAll(async () => {
    await db.user.create({
      data: {
        email: userCredentials.email,
        password: bcrypt.hashSync(userCredentials.password, 12),
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
      ...userCredentials,
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
      .send(userCredentials)

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
      .send(userCredentials)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('access_token')
    expect(Array.isArray(response.headers['set-cookie']))
    expect(response.headers['set-cookie'][0]).toContain('refresh_token')
    expect(response.body.access_token).toEqual(expect.any(String))
  })
})
