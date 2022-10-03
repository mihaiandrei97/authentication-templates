import bcrypt from 'bcrypt'
import { db } from '../../db'
import { User } from '@prisma/client'

export function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  })
}

export function createUserByEmailAndPassword(user: User) {
  user.password = bcrypt.hashSync(user.password, 12)
  return db.user.create({
    data: user,
  })
}

export function findUserById(id: User['id']) {
  return db.user.findUnique({
    where: {
      id,
    },
  })
}
