import request from 'supertest'
import app from '../../app'

describe('GET /api/v1/tasks', () => {
  let validAccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING!
  it('responds with an error if token is missing', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(401)
  })

  it('responds with an array of tasks', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})
