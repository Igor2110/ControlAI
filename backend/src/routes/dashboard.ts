import { Router } from 'express'
import { query, one } from '../db/pool.js'
import { addDays, lastDays, weekdayLabel } from '../lib/dates.js'
import { today } from '../lib/today.js'
import { PRODUCT_COLUMNS } from './products.js'

export const dashboardRouter = Router()

type DayRow = { d: string; vendas: number; pedidos: number }

async function salesByDay(userId: number, from: string): Promise<Map<string, DayRow>> {
  const rows = await query<DayRow>(
    `SELECT DATE(created_at) AS d, SUM(total) AS vendas, COUNT(*) AS pedidos
     FROM sales WHERE user_id = ? AND status = 'concluida' AND DATE(created_at) >= ? GROUP BY d`,
    [userId, from],
  )
  return new Map(rows.map((r) => [r.d, r]))
}

const pct = (now: number, before: number) => (before > 0 ? Math.round(((now - before) / before) * 1000) / 10 : null)

dashboardRouter.get('/', async (req, res) => {
  const now = await today()
  const days30 = lastDays(now, 30)
  const map = await salesByDay(req.userId, days30[0])
  const val = (d: string) => map.get(d)?.vendas ?? 0
  const orders = (d: string) => map.get(d)?.pedidos ?? 0

  const series = (days: string[]) =>
    days.map((d) => ({ date: d, label: days.length <= 7 ? weekdayLabel(d) : d.slice(8), vendas: val(d), pedidos: orders(d) }))
  const last7 = days30.slice(-7)
  const prev7 = lastDays(addDays(now, -7), 7)
  const sum = (days: string[], f: (d: string) => number) => days.reduce((a, d) => a + f(d), 0)

  const week = sum(last7, val)
  const weekOrders = sum(last7, orders)

  const month = (await one<{ entradas: number; saidas: number }>(
    `SELECT COALESCE(SUM(CASE WHEN type='entrada' THEN amount END),0) AS entradas,
            COALESCE(SUM(CASE WHEN type='saida' THEN amount END),0) AS saidas
     FROM transactions WHERE user_id = ? AND DATE_FORMAT(date,'%Y-%m') = ?`,
    [req.userId, now.slice(0, 7)],
  ))!

  const lowStock = await query(
    `SELECT * FROM (SELECT ${PRODUCT_COLUMNS} FROM products WHERE user_id = ? AND active = 1) p
     WHERE status <> 'ok' ORDER BY FIELD(status,'esgotado','critico','baixo'), stock LIMIT 6`,
    [req.userId],
  )
  const lowStockCount = (await one<{ n: number }>(
    `SELECT COUNT(*) AS n FROM products WHERE user_id = ? AND active = 1 AND stock < min_stock`,
    [req.userId],
  ))!.n

  const recentSales = await query(
    `SELECT s.id, c.name AS customerName, s.total, s.payment_method AS paymentMethod, s.status, s.created_at AS createdAt
     FROM sales s LEFT JOIN customers c ON c.id = s.customer_id
     WHERE s.user_id = ? ORDER BY s.created_at DESC, s.id DESC LIMIT 6`,
    [req.userId],
  )

  res.json({
    kpis: {
      salesToday: val(now),
      salesTodayVsYesterday: pct(val(now), val(addDays(now, -1))),
      ordersToday: orders(now),
      salesWeek: week,
      salesWeekVsPrevious: pct(week, sum(prev7, val)),
      averageTicket: weekOrders ? Math.round((week / weekOrders) * 100) / 100 : 0,
      monthBalance: Math.round((month.entradas - month.saidas) * 100) / 100,
      lowStockCount,
    },
    series7d: series(last7),
    series30d: series(days30),
    lowStock,
    recentSales,
  })
})
