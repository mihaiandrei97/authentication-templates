import request from 'supertest'

import app from '../app'

describe('app', () => {
  it('responds with a not found message', async () => {
    const response = await request(app).get('/what-is-this-even').set('Accept', 'application/json').expect('Content-Type', /json/)
    expect(response.statusCode).toBe(404)
  })
})

describe('GET /', () => {
  it('responds with a json message', async () => {

    const response = await request(app).get('/').set('Accept', 'application/json').expect('Content-Type', /json/)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('🦄🌈✨👋🌎🌍🌏✨🌈🦄')
  })
})

describe('GET /api/v1', () => {
  it('responds with a json message', async () => {
    const response = await request(app).get('/api/v1').set('Accept', 'application/json').expect('Content-Type', /json/)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('API - 👋🌎🌍🌏')
  })
})
