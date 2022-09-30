import request from 'supertest'
import app from '../../app'

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
})
