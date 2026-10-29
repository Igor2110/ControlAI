import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { exec, one } from '../db/pool.js'
import { HttpError } from '../lib/errors.js'
import { requireAuth, signToken } from '../middleware/auth.js'

export const authRouter = Router()

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  businessName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres').max(72),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
})

type UserRow = { id: number; name: string; email: string; business_name: string; password_hash: string }
const publicUser = (u: UserRow) => ({ id: u.id, name: u.name, email: u.email, businessName: u.business_name })

authRouter.post('/register', async (req, res) => {
  const data = registerSchema.parse(req.body)
  const exists = await one('SELECT id FROM users WHERE email = ?', [data.email])
  if (exists) throw new HttpError(409, 'Este e-mail já está cadastrado')
  const hash = await bcrypt.hash(data.password, 10)
  const result = await exec('INSERT INTO users (name, email, password_hash, business_name) VALUES (?, ?, ?, ?)', [
    data.name,
    data.email,
    hash,
    data.businessName,
  ])
  const user = (await one<UserRow>('SELECT * FROM users WHERE id = ?', [result.insertId]))!
  res.status(201).json({ token: signToken(user.id), user: publicUser(user) })
})

authRouter.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)
  const user = await one<UserRow>('SELECT * FROM users WHERE email = ?', [email])
  const ok = user ? await bcrypt.compare(password, user.password_hash) : false
  if (!user || !ok) throw new HttpError(401, 'E-mail ou senha incorretos')
  res.json({ token: signToken(user.id), user: publicUser(user) })
})

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await one<UserRow>('SELECT * FROM users WHERE id = ?', [req.userId])
  if (!user) throw new HttpError(401, 'Usuário não existe mais')
  res.json(publicUser(user))
})

authRouter.put('/me', requireAuth, async (req, res) => {
  const data = z
    .object({ name: z.string().trim().min(2).max(120), businessName: z.string().trim().min(2).max(120) })
    .parse(req.body)
  await exec('UPDATE users SET name = ?, business_name = ? WHERE id = ?', [data.name, data.businessName, req.userId])
  const user = (await one<UserRow>('SELECT * FROM users WHERE id = ?', [req.userId]))!
  res.json(publicUser(user))
})
