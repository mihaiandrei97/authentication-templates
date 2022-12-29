import * as z from 'zod'
require('dotenv').config()

enum EnvNames {
  NODE_ENV = 'NODE_ENV',
  DATABASE_URL = 'DATABASE_URL',
  JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET',
  JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET',
  JWT_ACCESS_LIFETIME = 'JWT_ACCESS_LIFETIME',
  JWT_REFRESH_LIFETIME = 'JWT_REFRESH_LIFETIME',
}

function getErrorMessage(environmentVariableName: EnvNames) {
  return {
    message: `Missing ${environmentVariableName} environment variable.`,
  }
}
export const configSchema = z.object({
  environment: z.string().min(1, getErrorMessage(EnvNames.NODE_ENV)),
  database_url: z.string().min(1, getErrorMessage(EnvNames.DATABASE_URL)),
  jwt_access_secret: z
    .string()
    .min(1, getErrorMessage(EnvNames.JWT_ACCESS_SECRET)),
  jwt_refresh_secret: z
    .string()
    .min(1, getErrorMessage(EnvNames.JWT_REFRESH_SECRET)),
  jwt_access_lifetime: z
    .string()
    .min(1, getErrorMessage(EnvNames.JWT_ACCESS_LIFETIME)),
  jwt_refresh_lifetime: z
    .string()
    .min(1, getErrorMessage(EnvNames.JWT_REFRESH_LIFETIME)),
  port: z.number().default(5000),
})

export type Config = z.infer<typeof configSchema>

const envConfig: Config = {
  environment: process.env.NODE_ENV || '',
  database_url: process.env.DATABASE_URL || '',
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || '',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || '',
  jwt_access_lifetime: process.env.JWT_ACCESS_LIFETIME || '',
  jwt_refresh_lifetime: process.env.JWT_REFRESH_LIFETIME || '',
  port: Number(process.env.PORT) || 5000,
}

export const config = configSchema.parse(envConfig)
