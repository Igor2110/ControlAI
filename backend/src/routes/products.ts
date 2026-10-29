import { Router } from 'express'
import { z } from 'zod'
import { exec, one, query } from '../db/pool.js'
import { notFound } from '../lib/errors.js'

export const productsRouter = Router()

/** Status do estoque: esgotado (0), crítico (<= metade do mínimo), baixo (< mínimo) ou ok. */
export const STOCK_STATUS_SQL = `CASE
  WHEN stock = 0 THEN 'esgotado'
  WHEN stock <= min_stock / 2 THEN 'critico'
  WHEN stock < min_stock THEN 'baixo'
  ELSE 'ok' END`

export const PRODUCT_COLUMNS = `id, name, category, price, stock, min_stock AS minStock, ${STOCK_STATUS_SQL} AS status`

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(60),
  price: z.coerce.number().min(0).max(1_000_000),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  minStock: z.coerce.number().int().min(0).max(1_000_000).default(0),
})

const listSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  status: z.enum(['ok', 'baixo', 'critico', 'esgotado']).optional(),
})

productsRouter.get('/', async (req, res) => {
  const { q, category, status } = listSchema.parse(req.query)
  const where = ['user_id = ?', 'active = 1']
  const params: unknown[] = [req.userId]
  if (q) {
    where.push('name LIKE ?')
    params.push(`%${q}%`)
  }
  if (category) {
    where.push('category = ?')
    params.push(category)
  }
  const rows = await query(
    `SELECT * FROM (SELECT ${PRODUCT_COLUMNS} FROM products WHERE ${where.join(' AND ')}) p
     ${status ? 'WHERE status = ?' : ''} ORDER BY name`,
    status ? [...params, status] : params,
  )
  res.json(rows)
})

productsRouter.get('/categories', async (req, res) => {
  const rows = await query<{ category: string }>(
    'SELECT DISTINCT category FROM products WHERE user_id = ? AND active = 1 ORDER BY category',
    [req.userId],
  )
  res.json(rows.map((r) => r.category))
})

productsRouter.get('/:id', async (req, res) => {
  const row = await one(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ? AND user_id = ? AND active = 1`, [
    req.params.id,
    req.userId,
  ])
  if (!row) throw notFound('Produto')
  res.json(row)
})

productsRouter.post('/', async (req, res) => {
  const d = productSchema.parse(req.body)
  const result = await exec('INSERT INTO products (user_id, name, category, price, stock, min_stock) VALUES (?, ?, ?, ?, ?, ?)', [
    req.userId,
    d.name,
    d.category,
    d.price,
    d.stock,
    d.minStock,
  ])
  res.status(201).json(await one(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ?`, [result.insertId]))
})

productsRouter.put('/:id', async (req, res) => {
  const d = productSchema.parse(req.body)
  const result = await exec(
    'UPDATE products SET name = ?, category = ?, price = ?, stock = ?, min_stock = ? WHERE id = ? AND user_id = ? AND active = 1',
    [d.name, d.category, d.price, d.stock, d.minStock, req.params.id, req.userId],
  )
  if (!result.affectedRows) throw notFound('Produto')
  res.json(await one(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ?`, [req.params.id]))
})

// Exclusão lógica: o histórico de vendas continua apontando para o produto.
productsRouter.delete('/:id', async (req, res) => {
  const result = await exec('UPDATE products SET active = 0 WHERE id = ? AND user_id = ? AND active = 1', [req.params.id, req.userId])
  if (!result.affectedRows) throw notFound('Produto')
  res.status(204).end()
})
