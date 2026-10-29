import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from '../src/app.js'
import { exec, pool } from '../src/db/pool.js'

const app = createApp()
const email = `teste-${Date.now()}@controlai.test`
let token = ''
let productId = 0
const auth = () => ({ Authorization: `Bearer ${token}` })

beforeAll(async () => {
  const res = await request(app).post('/api/auth/register').send({ name: 'Teste', businessName: 'Loja Teste', email, password: 'senha123' })
  token = res.body.token
})

afterAll(async () => {
  await exec('DELETE FROM users WHERE email = ?', [email]) // apaga tudo em cascata
  await pool.end()
})

describe('autenticação', () => {
  it('rejeita e-mail repetido', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Outro', businessName: 'Loja', email, password: 'senha123' })
    expect(res.status).toBe(409)
  })
  it('rejeita senha errada', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'errada' })
    expect(res.status).toBe(401)
  })
  it('bloqueia rotas sem token', async () => {
    expect((await request(app).get('/api/products')).status).toBe(401)
  })
})

describe('produtos', () => {
  it('valida os dados', async () => {
    const res = await request(app).post('/api/products').set(auth()).send({ name: 'x', category: 'y', price: -1, stock: 1 })
    expect(res.status).toBe(400)
  })
  it('cria produto com status calculado', async () => {
    const res = await request(app).post('/api/products').set(auth()).send({ name: 'Café 250g', category: 'Mercearia', price: 12.5, stock: 8, minStock: 10 })
    expect(res.status).toBe(201)
    expect(res.body.status).toBe('baixo')
    productId = res.body.id
  })
})

describe('vendas', () => {
  it('registra venda, baixa o estoque e lança a entrada no caixa', async () => {
    const res = await request(app)
      .post('/api/sales')
      .set(auth())
      .send({ paymentMethod: 'pix', discount: 5, items: [{ productId, quantity: 2 }] })
    expect(res.status).toBe(201)
    expect(res.body.total).toBe(20) // 2 x 12,50 - 5
    const product = await request(app).get(`/api/products/${productId}`).set(auth())
    expect(product.body.stock).toBe(6)
    const tx = await request(app).get('/api/finance/transactions').set(auth())
    expect(tx.body[0]).toMatchObject({ type: 'entrada', amount: 20, saleId: res.body.id })
  })

  it('recusa venda sem estoque suficiente e não altera nada', async () => {
    const res = await request(app).post('/api/sales').set(auth()).send({ paymentMethod: 'pix', items: [{ productId, quantity: 99 }] })
    expect(res.status).toBe(409)
    const product = await request(app).get(`/api/products/${productId}`).set(auth())
    expect(product.body.stock).toBe(6)
  })

  it('cancela a venda devolvendo estoque e removendo a entrada', async () => {
    const list = await request(app).get('/api/sales').set(auth())
    const saleId = list.body.data[0].id
    const res = await request(app).post(`/api/sales/${saleId}/cancel`).set(auth())
    expect(res.body.status).toBe('cancelada')
    expect((await request(app).get(`/api/products/${productId}`).set(auth())).body.stock).toBe(8)
    expect((await request(app).get('/api/finance/transactions').set(auth())).body).toHaveLength(0)
    expect((await request(app).post(`/api/sales/${saleId}/cancel`).set(auth())).status).toBe(409)
  })
})

describe('isolamento entre negócios', () => {
  it('um usuário não enxerga os produtos de outro', async () => {
    const other = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Outro', businessName: 'Outra Loja', email: `outro-${Date.now()}@controlai.test`, password: 'senha123' })
    const res = await request(app).get(`/api/products/${productId}`).set({ Authorization: `Bearer ${other.body.token}` })
    expect(res.status).toBe(404)
    await exec('DELETE FROM users WHERE id = ?', [other.body.user.id])
  })
})
