import { db } from './db'
import * as bcrypt from 'bcrypt'
import { generateAccessToken } from './utils/jwt'

export const globalUserCredentials = {
  id: 'cl9fpgbug00032e6djr6s4ydf',
  email: 'mihai@test.com',
  password: 'Test1@123',
}

const setup = async () => {
  console.log('---------TESTS STARTED--------')
  const user = await db.user.create({
    data: {
      id: globalUserCredentials.id,
      password: bcrypt.hashSync(globalUserCredentials.password, 12),
      email: globalUserCredentials.email,
    },
  })
  const validToken = generateAccessToken({ userId: user.id }, '15m')
  process.env.VALID_ACCESS_TOKEN_FOR_TESTING = validToken
}

export default setup
