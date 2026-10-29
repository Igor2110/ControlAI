import { Router } from 'express'
import { z } from 'zod'
import { exec, one, query } from '../db/pool.js'
import { notFound } from '../lib/errors.js'

export const customersRouter = Router()

const customerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional().nullable(),
  email: z.union([z.string().trim().email().max(160), z.literal('')]).optional().nullable(),
})

// "recorrente" = 10 compras ou mais; "inativo" = última compra há mais de 30 dias.
const SELECT_CUSTOMERS = `
  SELECT c.id, c.name, c.phone, c.email,
         COUNT(s.id) AS orders,
         COALESCE(SUM(s.total), 0) AS totalSpent,
         MAX(s.created_at) AS lastPurchase,
         CASE
           WHEN COUNT(s.id) >= 10 THEN 'recorrente'
           WHEN COUNT(s.id) > 0 AND MAX(s.created_at) < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'inativo'
           ELSE 'ativo' END AS status
  FROM customers c
  LEFT JOIN sales s ON s.customer_id = c.id AND s.status = 'concluida'
  WHERE c.user_id = ?`

customersRouter.get('/', async (req, res) => {
  const q = z.string().trim().optional().parse(req.query.q)
  const rows = await query(
    `${SELECT_CUSTOMERS} ${q ? 'AND c.name LIKE ?' : ''} GROUP BY c.id ORDER BY c.name`,
    q ? [req.userId, `%${q}%`] : [req.userId],
  )
  res.json(rows)
})

customersRouter.get('/:id', async (req, res) => {
  const row = await one(`${SELECT_CUSTOMERS} AND c.id = ? GROUP BY c.id`, [req.userId, req.params.id])
  if (!row) throw notFound('Cliente')
  res.json(row)
})

customersRouter.post('/', async (req, res) => {
  const d = customerSchema.parse(req.body)
  const result = await exec('INSERT INTO customers (user_id, name, phone, email) VALUES (?, ?, ?, ?)', [
    req.userId,
    d.name,
    d.phone || null,
    d.email || null,
  ])
  res.status(201).json(await one(`${SELECT_CUSTOMERS} AND c.id = ? GROUP BY c.id`, [req.userId, result.insertId]))
})

customersRouter.put('/:id', async (req, res) => {
  const d = customerSchema.parse(req.body)
  const result = await exec('UPDATE customers SET name = ?, phone = ?, email = ? WHERE id = ? AND user_id = ?', [
    d.name,
    d.phone || null,
    d.email || null,
    req.params.id,
    req.userId,
  ])
  if (!result.affectedRows) throw notFound('Cliente')
  res.json(await one(`${SELECT_CUSTOMERS} AND c.id = ? GROUP BY c.id`, [req.userId, req.params.id]))
})

customersRouter.delete('/:id', async (req, res) => {
  const result = await exec('DELETE FROM customers WHERE id = ? AND user_id = ?', [req.params.id, req.userId])
  if (!result.affectedRows) throw notFound('Cliente')
  res.status(204).end()
})
