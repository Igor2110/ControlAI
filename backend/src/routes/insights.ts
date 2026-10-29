import { Router } from 'express'
import { one, query } from '../db/pool.js'
import { addDays, weekdayLabel } from '../lib/dates.js'
import { today } from '../lib/today.js'

export const insightsRouter = Router()

type Insight = { type: 'alerta' | 'dica' | 'info'; title: string; text: string }
const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * "Assistente" baseado em regras: lê os dados reais do negócio e gera recomendações.
 * Não usa modelo de linguagem; cada regra é simples e explicável.
 */
insightsRouter.get('/', async (req, res) => {
  const uid = req.userId
  const now = await today()
  const out: Insight[] = []

  const stock = await query<{ name: string; stock: number; min_stock: number }>(
    'SELECT name, stock, min_stock FROM products WHERE user_id = ? AND active = 1 AND stock < min_stock ORDER BY stock / GREATEST(min_stock,1) LIMIT 5',
    [uid],
  )
  const empty = stock.filter((p) => p.stock === 0)
  if (empty.length)
    out.push({ type: 'alerta', title: 'Produtos esgotados', text: `${empty.map((p) => p.name).join(', ')} ${empty.length > 1 ? 'estão' : 'está'} sem estoque. Você pode estar perdendo vendas.` })
  const low = stock.filter((p) => p.stock > 0)
  if (low.length)
    out.push({ type: 'alerta', title: 'Estoque abaixo do mínimo', text: `Reponha: ${low.map((p) => `${p.name} (${p.stock} de ${p.min_stock})`).join(', ')}.` })

  const w = (from: string, to: string) =>
    one<{ total: number }>(
      `SELECT COALESCE(SUM(total),0) AS total FROM sales WHERE user_id = ? AND status='concluida' AND DATE(created_at) BETWEEN ? AND ?`,
      [uid, from, to],
    )
  const thisWeek = (await w(addDays(now, -6), now))!.total
  const prevWeek = (await w(addDays(now, -13), addDays(now, -7)))!.total
  if (prevWeek > 0) {
    const diff = Math.round(((thisWeek - prevWeek) / prevWeek) * 100)
    out.push(
      diff >= 0
        ? { type: 'info', title: 'Vendas em alta', text: `Você vendeu ${brl(thisWeek)} nos últimos 7 dias, ${diff}% a mais que na semana anterior.` }
        : { type: 'alerta', title: 'Vendas em queda', text: `As vendas dos últimos 7 dias (${brl(thisWeek)}) ficaram ${Math.abs(diff)}% abaixo da semana anterior.` },
    )
  }

  const days = await query<{ d: string; total: number }>(
    `SELECT DATE(created_at) AS d, SUM(total) AS total FROM sales
     WHERE user_id = ? AND status='concluida' AND DATE(created_at) >= ? GROUP BY d`,
    [uid, addDays(now, -55)],
  )
  if (days.length >= 7) {
    const byWeekday = new Map<string, number[]>()
    for (const r of days) byWeekday.set(weekdayLabel(r.d), [...(byWeekday.get(weekdayLabel(r.d)) ?? []), r.total])
    const avg = [...byWeekday].map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length] as const).sort((a, b) => b[1] - a[1])
    out.push({ type: 'dica', title: 'Seu melhor dia de vendas', text: `${avg[0][0]} costuma ser o dia mais forte (média de ${brl(avg[0][1])}). Garanta estoque e equipe nesse dia.` })
  }

  const month = (await one<{ e: number; s: number }>(
    `SELECT COALESCE(SUM(CASE WHEN type='entrada' THEN amount END),0) AS e, COALESCE(SUM(CASE WHEN type='saida' THEN amount END),0) AS s
     FROM transactions WHERE user_id = ? AND DATE_FORMAT(date,'%Y-%m') = ?`,
    [uid, now.slice(0, 7)],
  ))!
  if (month.s > month.e)
    out.push({ type: 'alerta', title: 'Caixa no vermelho', text: `Neste mês as saídas (${brl(month.s)}) superam as entradas (${brl(month.e)}).` })
  else if (month.e > 0)
    out.push({ type: 'info', title: 'Saldo do mês', text: `Entradas de ${brl(month.e)} e saídas de ${brl(month.s)}: saldo de ${brl(month.e - month.s)}.` })

  const inactive = await query<{ name: string }>(
    `SELECT c.name FROM customers c JOIN sales s ON s.customer_id = c.id AND s.status='concluida'
     WHERE c.user_id = ? GROUP BY c.id HAVING MAX(s.created_at) < DATE_SUB(NOW(), INTERVAL 30 DAY) AND COUNT(s.id) >= 2
     ORDER BY SUM(s.total) DESC LIMIT 3`,
    [uid],
  )
  if (inactive.length)
    out.push({ type: 'dica', title: 'Clientes para reconquistar', text: `${inactive.map((c) => c.name).join(', ')} compraram mais de uma vez, mas estão há mais de 30 dias sem comprar. Que tal chamar no WhatsApp?` })

  if (!out.length) out.push({ type: 'info', title: 'Tudo certo por aqui', text: 'Ainda não há dados suficientes para gerar recomendações. Cadastre produtos e registre vendas.' })
  res.json(out)
})
