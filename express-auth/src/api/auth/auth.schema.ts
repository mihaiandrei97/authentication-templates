import * as z from 'zod'

export const registerSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email or password'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
})

export const registerQuerySchema = z.object({
  refreshTokenInCookie: z.enum(['true', 'false']).default('false'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type RegisterQuerySchema = z.infer<typeof registerQuerySchema>
