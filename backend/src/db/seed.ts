import bcrypt from 'bcryptjs'
import { exec, one, pool } from './pool.js'
import { addDays, lastMonths } from '../lib/dates.js'
import { today } from '../lib/today.js'

/** Gera dados de demonstração: um negócio fictício (lanchonete) com ~4 meses de histórico. */
const DEMO = { name: 'João Costa', email: 'demo@controlai.com', password: 'demo1234', business: 'Lanchonete do João' }

// Gerador pseudoaleatório com semente fixa: o seed produz sempre os mesmos dados.
let state = 20260101
const rand = () => ((state = (state * 1664525 + 1013904223) % 4294967296) / 4294967296)
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)]

const products = [
  ['Hambúrguer artesanal', 'Alimentos', 32.0, 40, 15],
  ['Batata frita 2kg', 'Alimentos', 18.0, 2, 10],
  ['Pão de hambúrguer', 'Padaria', 1.2, 18, 20],
  ['Queijo prato kg', 'Laticínios', 45.0, 0, 5],
  ['Coca-Cola 350ml', 'Bebidas', 5.5, 4, 20],
  ['Água mineral 500ml', 'Bebidas', 2.5, 48, 30],
  ['Refrigerante Guaraná', 'Bebidas', 6.0, 22, 15],
  ['Suco de laranja 1L', 'Bebidas', 12.0, 3, 12],
  ['Maionese 500g', 'Condimentos', 14.0, 9, 8],
  ['Combo hambúrguer + refri', 'Alimentos', 36.0, 30, 10],
] as const

const customers = [
  ['Carlos Silva', '(11) 99234-5678'],
  ['Ana Souza', '(11) 98765-4321'],
  ['Pedro Oliveira', '(21) 97654-3210'],
  ['Maria Lima', '(31) 96543-2109'],
  ['Lucas Costa', '(11) 95432-1098'],
  ['Juliana Ferreira', '(41) 94321-0987'],
] as const

const now = await today()
await exec('DELETE FROM users WHERE email = ?', [DEMO.email])
const user = await exec('INSERT INTO users (name, email, password_hash, business_name) VALUES (?, ?, ?, ?)', [
  DEMO.name,
  DEMO.email,
  await bcrypt.hash(DEMO.password, 10),
  DEMO.business,
])
const uid = user.insertId

const prod: { id: number; name: string; category: string; price: number }[] = []
for (const [name, category, price, stock, min] of products) {
  const r = await exec('INSERT INTO products (user_id, name, category, price, stock, min_stock) VALUES (?, ?, ?, ?, ?, ?)', [uid, name, category, price, stock, min])
  prod.push({ id: r.insertId, name, category, price })
}
const cust: number[] = []
for (const [name, phone] of customers) {
  cust.push((await exec('INSERT INTO customers (user_id, name, phone) VALUES (?, ?, ?)', [uid, name, phone])).insertId)
}

const DAYS = 120
for (let back = DAYS; back >= 0; back--) {
  const date = addDays(now, -back)
  const dow = new Date(`${date}T00:00:00Z`).getUTCDay()
  const orders = Math.round(4 + rand() * 4 + (dow === 5 || dow === 6 ? 3 : 0) + (DAYS - back) / 40)
  for (let n = 0; n < orders; n++) {
    const items = Array.from({ length: 1 + Math.floor(rand() * 3) }, () => ({ p: pick(prod), q: 1 + Math.floor(rand() * 3) }))
    const total = Math.round(items.reduce((a, i) => a + i.p.price * i.q, 0) * 100) / 100
    // A última cliente fica sem comprar há mais de 40 dias (aparece como "inativa").
    const pool_ = back < 40 ? cust.slice(0, 5) : cust
    const customer = rand() < 0.7 ? pick(pool_) : null
    const hour = 10 + Math.floor(rand() * 11)
    const time = `${date} ${String(hour).padStart(2, '0')}:${String(Math.floor(rand() * 60)).padStart(2, '0')}:00`
    const cancelled = rand() < 0.03
    const s = await exec('INSERT INTO sales (user_id, customer_id, payment_method, discount, total, status, created_at) VALUES (?, ?, ?, 0, ?, ?, ?)', [
      uid,
      customer,
      pick(['pix', 'pix', 'cartao', 'dinheiro']),
      total,
      cancelled ? 'cancelada' : 'concluida',
      time,
    ])
    for (const i of items)
      await exec('INSERT INTO sale_items (sale_id, product_id, product_name, category, unit_price, quantity) VALUES (?, ?, ?, ?, ?, ?)', [s.insertId, i.p.id, i.p.name, i.p.category, i.p.price, i.q])
    if (!cancelled)
      await exec("INSERT INTO transactions (user_id, sale_id, type, category, description, amount, date) VALUES (?, ?, 'entrada', 'Vendas', ?, ?, ?)", [uid, s.insertId, `Venda #${s.insertId}`, total, date])
  }
}

// Despesas fixas e variáveis dos últimos meses.
const expenses = [
  ['Despesas fixas', 'Aluguel', 1800, 5],
  ['Despesas fixas', 'Energia elétrica', 420, 12],
  ['Despesas fixas', 'Internet', 119.9, 15],
  ['Compras', 'Fornecedor - Bebidas Ltda', 950, 8],
  ['Compras', 'Fornecedor - Carnes e frios', 1500, 18],
] as const
for (const ym of lastMonths(now, 5)) {
  for (const [category, description, amount, day] of expenses) {
    const date = `${ym}-${String(day).padStart(2, '0')}`
    if (date > now) continue
    const variation = description.startsWith('Fornecedor') ? 1 + (rand() - 0.5) * 0.3 : 1
    await exec("INSERT INTO transactions (user_id, type, category, description, amount, date) VALUES (?, 'saida', ?, ?, ?, ?)", [
      uid,
      category,
      description,
      Math.round(amount * variation * 100) / 100,
      date,
    ])
  }
}

const count = await one<{ n: number }>('SELECT COUNT(*) AS n FROM sales WHERE user_id = ?', [uid])
console.log(`Dados de demonstração criados (${count?.n} vendas).`)
console.log(`Login: ${DEMO.email}  |  Senha: ${DEMO.password}`)
await pool.end()
