import { db } from './db'
import * as bcrypt from 'bcrypt'
import { generateAccessToken } from './utils/jwt'

export const globalUserCredentials = {
  id: 'cl9fpgbug00032e6djr6s4ydf',
  email: 'mihai@test.com',
  password: 'Test1@123',
}

export const tasks = [
  { content: 'Task1', favourite: false },
  { content: 'Task2', favourite: true },
  { content: 'Task3', favourite: false },
]

const setup = async () => {
  console.log('---------TESTS STARTED--------')

  // user setup
  const user = await db.user.create({
    data: {
      id: globalUserCredentials.id,
      password: bcrypt.hashSync(globalUserCredentials.password, 12),
      email: globalUserCredentials.email,
    },
  })
  const validToken = generateAccessToken({ userId: user.id }, '15m')
  process.env.VALID_ACCESS_TOKEN_FOR_TESTING = validToken

  // tasks setup
  for (const task of tasks) {
    await db.task.create({
      // data: { ...task, user: { connect: { id: user.id } } },
      data: { ...task, userId: user.id },
    })
  }
}

export default setup
