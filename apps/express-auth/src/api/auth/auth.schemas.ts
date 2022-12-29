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

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email or password'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Invalid credentials'),
})

export const loginQuerySchema = z.object({
  refreshTokenInCookie: z.enum(['true', 'false']).default('false'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type LoginQuerySchema = z.infer<typeof loginQuerySchema>

export const refreshTokenSchema = z.object({
  refresh_token: z.string().optional(),
})

export type RefreshInput = z.infer<typeof refreshTokenSchema>
