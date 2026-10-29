import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { config } from './config.js'
import { requireAuth } from './middleware/auth.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'
import { productsRouter } from './routes/products.js'
import { customersRouter } from './routes/customers.js'
import { salesRouter } from './routes/sales.js'
import { financeRouter } from './routes/finance.js'
import { dashboardRouter } from './routes/dashboard.js'
import { reportsRouter } from './routes/reports.js'
import { insightsRouter } from './routes/insights.js'
import { pool } from './db/pool.js'

export function createApp() {
  const app = express()
  app.use(helmet())
  app.use(cors({ origin: config.CORS_ORIGIN.split(',') }))
  app.use(express.json({ limit: '100kb' }))
  if (config.NODE_ENV !== 'test') app.use(morgan('dev'))

  app.get('/api/health', async (_req, res) => {
    await pool.query('SELECT 1')
    res.json({ status: 'ok' })
  })

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, skip: () => config.NODE_ENV === 'test' })
  app.use('/api/auth', authLimiter, authRouter)

  app.use('/api/products', requireAuth, productsRouter)
  app.use('/api/customers', requireAuth, customersRouter)
  app.use('/api/sales', requireAuth, salesRouter)
  app.use('/api/finance', requireAuth, financeRouter)
  app.use('/api/dashboard', requireAuth, dashboardRouter)
  app.use('/api/reports', requireAuth, reportsRouter)
  app.use('/api/insights', requireAuth, insightsRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
