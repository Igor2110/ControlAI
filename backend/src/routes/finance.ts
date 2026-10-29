import { Router } from 'express'
import { z } from 'zod'
import { exec, one, query } from '../db/pool.js'
import { HttpError, notFound } from '../lib/errors.js'
import { lastMonths, monthLabel } from '../lib/dates.js'
import { today } from '../lib/today.js'

export const financeRouter = Router()

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const listSchema = z.object({
  type: z.enum(['entrada', 'saida']).optional(),
  from: dateStr.optional(),
  to: dateStr.optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
})

const createSchema = z.object({
  type: z.enum(['entrada', 'saida']),
  category: z.string().trim().min(2).max(60),
  description: z.string().trim().min(2).max(200),
  amount: z.coerce.number().positive().max(100_000_000),
  date: dateStr.optional(),
})

const TX_SELECT = `SELECT id, sale_id AS saleId, type, category, description, amount, date FROM transactions`

financeRouter.get('/transactions', async (req, res) => {
  const f = listSchema.parse(req.query)
  const where = ['user_id = ?']
  const params: unknown[] = [req.userId]
  if (f.type) (where.push('type = ?'), params.push(f.type))
  if (f.from) (where.push('date >= ?'), params.push(f.from))
  if (f.to) (where.push('date <= ?'), params.push(f.to))
  res.json(await query(`${TX_SELECT} WHERE ${where.join(' AND ')} ORDER BY date DESC, id DESC LIMIT ?`, [...params, f.limit]))
})

financeRouter.post('/transactions', async (req, res) => {
  const d = createSchema.parse(req.body)
  const result = await exec(
    'INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, ?, ?, ?, ?, COALESCE(?, CURDATE()))',
    [req.userId, d.type, d.category, d.description, d.amount, d.date ?? null],
  )
  res.status(201).json(await one(`${TX_SELECT} WHERE id = ?`, [result.insertId]))
})

// Lançamentos gerados por vendas só mudam cancelando a venda.
financeRouter.delete('/transactions/:id', async (req, res) => {
  const tx = await one<{ sale_id: number | null }>('SELECT sale_id FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.userId])
  if (!tx) throw notFound('Lançamento')
  if (tx.sale_id) throw new HttpError(409, 'Este lançamento veio de uma venda. Cancele a venda para removê-lo.')
  await exec('DELETE FROM transactions WHERE id = ?', [req.params.id])
  res.status(204).end()
})

financeRouter.get('/summary', async (req, res) => {
  const months = z.coerce.number().int().min(1).max(12).default(6).parse(req.query.months)
  const now = await today()
  const names = lastMonths(now, months)
  const rows = await query<{ ym: string; entradas: number; saidas: number }>(
    `SELECT DATE_FORMAT(date, '%Y-%m') AS ym,
            COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount END), 0) AS entradas,
            COALESCE(SUM(CASE WHEN type = 'saida' THEN amount END), 0) AS saidas
     FROM transactions WHERE user_id = ? AND date >= ? GROUP BY ym`,
    [req.userId, `${names[0]}-01`],
  )
  const byMonth = new Map(rows.map((r) => [r.ym, r]))
  const monthly = names.map((ym) => ({
    month: ym,
    label: monthLabel(ym),
    entradas: byMonth.get(ym)?.entradas ?? 0,
    saidas: byMonth.get(ym)?.saidas ?? 0,
  }))
  const current = monthly[monthly.length - 1]
  const expenses = await query<{ category: string; total: number }>(
    `SELECT category, SUM(amount) AS total FROM transactions
     WHERE user_id = ? AND type = 'saida' AND DATE_FORMAT(date, '%Y-%m') = ? GROUP BY category ORDER BY total DESC`,
    [req.userId, current.month],
  )
  res.json({
    currentMonth: { entradas: current.entradas, saidas: current.saidas, saldo: Math.round((current.entradas - current.saidas) * 100) / 100 },
    monthly,
    expensesByCategory: expenses,
  })
})
