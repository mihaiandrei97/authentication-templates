import crypto from 'crypto'

export function hashToken(token: string) {
  return crypto.createHash('sha512').update(token).digest('hex')
}
