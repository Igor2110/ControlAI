import { Router } from 'express'
import { z } from 'zod'
import { exec, one, query, transaction } from '../db/pool.js'
import { HttpError, notFound } from '../lib/errors.js'

export const salesRouter = Router()

const createSchema = z.object({
  customerId: z.coerce.number().int().positive().nullable().optional(),
  paymentMethod: z.enum(['pix', 'dinheiro', 'cartao']),
  discount: z.coerce.number().min(0).default(0),
  items: z
    .array(z.object({ productId: z.coerce.number().int().positive(), quantity: z.coerce.number().int().min(1).max(10_000) }))
    .min(1, 'Adicione ao menos um item'),
})

const listSchema = z.object({
  status: z.enum(['concluida', 'cancelada']).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  offset: z.coerce.number().int().min(0).default(0),
})

const SALE_SELECT = `
  SELECT s.id, s.customer_id AS customerId, c.name AS customerName, s.payment_method AS paymentMethod,
         s.discount, s.total, s.status, s.created_at AS createdAt,
         (SELECT COALESCE(SUM(quantity), 0) FROM sale_items WHERE sale_id = s.id) AS itemsCount
  FROM sales s LEFT JOIN customers c ON c.id = s.customer_id`

salesRouter.get('/', async (req, res) => {
  const f = listSchema.parse(req.query)
  const where = ['s.user_id = ?']
  const params: unknown[] = [req.userId]
  if (f.status) (where.push('s.status = ?'), params.push(f.status))
  if (f.from) (where.push('DATE(s.created_at) >= ?'), params.push(f.from))
  if (f.to) (where.push('DATE(s.created_at) <= ?'), params.push(f.to))
  const rows = await query(`${SALE_SELECT} WHERE ${where.join(' AND ')} ORDER BY s.created_at DESC, s.id DESC LIMIT ? OFFSET ?`, [
    ...params,
    f.limit,
    f.offset,
  ])
  const total = await one<{ n: number }>(`SELECT COUNT(*) AS n FROM sales s WHERE ${where.join(' AND ')}`, params)
  res.json({ data: rows, total: total?.n ?? 0 })
})

async function loadSale(id: number | string, userId: number) {
  const sale = await one(`${SALE_SELECT} WHERE s.id = ? AND s.user_id = ?`, [id, userId])
  if (!sale) throw notFound('Venda')
  const items = await query(
    'SELECT id, product_id AS productId, product_name AS name, unit_price AS unitPrice, quantity FROM sale_items WHERE sale_id = ?',
    [id],
  )
  return { ...sale, items }
}

salesRouter.get('/:id', async (req, res) => {
  res.json(await loadSale(req.params.id, req.userId))
})

salesRouter.post('/', async (req, res) => {
  const d = createSchema.parse(req.body)
  const saleId = await transaction(async (conn) => {
    if (d.customerId) {
      const c = await one('SELECT id FROM customers WHERE id = ? AND user_id = ?', [d.customerId, req.userId], conn)
      if (!c) throw new HttpError(400, 'Cliente inválido')
    }

    // Junta itens repetidos e trava as linhas dos produtos até o fim da transação (evita estoque negativo em vendas simultâneas).
    const qty = new Map<number, number>()
    for (const it of d.items) qty.set(it.productId, (qty.get(it.productId) ?? 0) + it.quantity)
    const ids = [...qty.keys()]
    const products = await query<{ id: number; name: string; category: string; price: number; stock: number }>(
      'SELECT id, name, category, price, stock FROM products WHERE id IN (?) AND user_id = ? AND active = 1 FOR UPDATE',
      [ids, req.userId],
      conn,
    )
    if (products.length !== ids.length) throw new HttpError(400, 'Algum produto não existe')

    let subtotal = 0
    for (const p of products) {
      const q = qty.get(p.id)!
      if (p.stock < q) throw new HttpError(409, `Estoque insuficiente de "${p.name}" (disponível: ${p.stock})`)
      subtotal += p.price * q
    }
    subtotal = Math.round(subtotal * 100) / 100
    if (d.discount > subtotal) throw new HttpError(400, 'O desconto não pode ser maior que o total')
    const total = Math.round((subtotal - d.discount) * 100) / 100

    const sale = await exec(
      'INSERT INTO sales (user_id, customer_id, payment_method, discount, total) VALUES (?, ?, ?, ?, ?)',
      [req.userId, d.customerId ?? null, d.paymentMethod, d.discount, total],
      conn,
    )
    for (const p of products) {
      const q = qty.get(p.id)!
      await exec(
        'INSERT INTO sale_items (sale_id, product_id, product_name, category, unit_price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
        [sale.insertId, p.id, p.name, p.category, p.price, q],
        conn,
      )
      await exec('UPDATE products SET stock = stock - ? WHERE id = ?', [q, p.id], conn)
    }
    await exec(
      `INSERT INTO transactions (user_id, sale_id, type, category, description, amount, date)
       VALUES (?, ?, 'entrada', 'Vendas', ?, ?, CURDATE())`,
      [req.userId, sale.insertId, `Venda #${sale.insertId}`, total],
      conn,
    )
    return sale.insertId
  })
  res.status(201).json(await loadSale(saleId, req.userId))
})

// Cancelar devolve os itens ao estoque e remove a entrada do caixa.
salesRouter.post('/:id/cancel', async (req, res) => {
  await transaction(async (conn) => {
    const sale = await one<{ id: number; status: string }>(
      'SELECT id, status FROM sales WHERE id = ? AND user_id = ? FOR UPDATE',
      [req.params.id, req.userId],
      conn,
    )
    if (!sale) throw notFound('Venda')
    if (sale.status === 'cancelada') throw new HttpError(409, 'Esta venda já foi cancelada')
    const items = await query<{ product_id: number | null; quantity: number }>(
      'SELECT product_id, quantity FROM sale_items WHERE sale_id = ?',
      [sale.id],
      conn,
    )
    for (const it of items) {
      if (it.product_id) await exec('UPDATE products SET stock = stock + ? WHERE id = ?', [it.quantity, it.product_id], conn)
    }
    await exec("UPDATE sales SET status = 'cancelada' WHERE id = ?", [sale.id], conn)
    await exec('DELETE FROM transactions WHERE sale_id = ?', [sale.id], conn)
  })
  res.json(await loadSale(req.params.id, req.userId))
})
