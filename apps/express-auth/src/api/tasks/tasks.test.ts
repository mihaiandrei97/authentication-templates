import request from 'supertest'
import app from '../../app'

let validAccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING!
let id: string = ''
const task = {
  content: 'Task 1',
  favourite: false,
}

describe('GET /api/v1/tasks', () => {
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
    expect(response.body.length).toBe(3)
  })
})

describe('POST /api/v1/tasks', () => {
  it('responds with an error if token is missing', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(401)
  })

  it('responds with an error if task is invalid', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  it('responds with the inserted object', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)
      .send(task)

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('content')
    expect(response.body).toHaveProperty('favourite')
    expect(response.body.content).toBe(task.content)
    expect(response.body.favourite).toBe(task.favourite)
    id = response.body.id
  })
})

describe('GET /api/v1/tasks/:id', () => {
  it('responds with an error if token is missing', async () => {
    const response = await request(app)
      .get(`/api/v1/tasks/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(401)
  })

  it('responds with a not found error', async () => {
    const response = await request(app)
      .get(`/api/v1/tasks/1231231231`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(404)
  })

  it('responds with the inserted object', async () => {
    const response = await request(app)
      .get(`/api/v1/tasks/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('content')
    expect(response.body).toHaveProperty('favourite')
    expect(response.body.content).toBe(task.content)
    expect(response.body.favourite).toBe(task.favourite)
    id = response.body.id
  })
})

describe('PUT /api/v1/tasks/:id', () => {
  it('responds with an error if token is missing', async () => {
    const response = await request(app)
      .put(`/api/v1/tasks/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(401)
  })

  it('responds with a not found error', async () => {
    const response = await request(app)
      .put(`/api/v1/tasks/1231231231`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)
      .send(task)

    expect(response.statusCode).toBe(404)
  })

  it('responds with an error if task is invalid', async () => {
    const response = await request(app)
      .put(`/api/v1/tasks/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  it('responds with the updated object', async () => {
    const response = await request(app)
      .put(`/api/v1/tasks/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${validAccessToken}`)
      .expect('Content-Type', /json/)
      .send({ content: 'Task 1 updated', favourite: true })

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('content')
    expect(response.body).toHaveProperty('favourite')
    expect(response.body.content).toBe('Task 1 updated')
    expect(response.body.favourite).toBe(true)
  })
})
