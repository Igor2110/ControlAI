import { Router } from 'express'
import { z } from 'zod'
import { query } from '../db/pool.js'
import { addDays } from '../lib/dates.js'
import { today } from '../lib/today.js'

export const reportsRouter = Router()

const periodSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

async function period(q: unknown) {
  const p = periodSchema.parse(q)
  const to = p.to ?? (await today())
  const from = p.from ?? addDays(to, -29)
  return { from, to }
}

// Todos os relatórios consideram apenas vendas concluídas.
const BASE = `FROM sale_items i JOIN sales s ON s.id = i.sale_id
  WHERE s.user_id = ? AND s.status = 'concluida' AND DATE(s.created_at) BETWEEN ? AND ?`

reportsRouter.get('/by-category', async (req, res) => {
  const { from, to } = await period(req.query)
  const data = await query(
    `SELECT i.category, SUM(i.unit_price * i.quantity) AS total, SUM(i.quantity) AS quantity ${BASE} GROUP BY i.category ORDER BY total DESC`,
    [req.userId, from, to],
  )
  res.json({ from, to, data })
})

reportsRouter.get('/top-products', async (req, res) => {
  const { from, to } = await period(req.query)
  const limit = z.coerce.number().int().min(1).max(20).default(5).parse(req.query.limit)
  const data = await query(
    `SELECT i.product_name AS name, SUM(i.quantity) AS quantity, SUM(i.unit_price * i.quantity) AS total ${BASE}
     GROUP BY i.product_name ORDER BY quantity DESC, total DESC LIMIT ?`,
    [req.userId, from, to, limit],
  )
  res.json({ from, to, data })
})

reportsRouter.get('/by-payment', async (req, res) => {
  const { from, to } = await period(req.query)
  const data = await query(
    `SELECT payment_method AS method, COUNT(*) AS orders, SUM(total) AS total FROM sales
     WHERE user_id = ? AND status = 'concluida' AND DATE(created_at) BETWEEN ? AND ? GROUP BY payment_method ORDER BY total DESC`,
    [req.userId, from, to],
  )
  res.json({ from, to, data })
})
