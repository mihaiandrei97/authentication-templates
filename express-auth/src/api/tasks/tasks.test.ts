import request from 'supertest'
import app from '../../app'

describe('GET /api/v1/tasks', () => {
  it('responds with an array of todos', async () => {
    const response = await request(app)
      .get('/api/v1/tasks')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body))
  })
})
