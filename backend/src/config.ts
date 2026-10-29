import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3333),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default('controlai'),
  DB_PASSWORD: z.string().default('controlai'),
  DB_NAME: z.string().default('controlai'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET precisa ter ao menos 8 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('Configuração inválida:', parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
  process.exit(1)
}

export const config = parsed.data
