import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { HttpError } from '../lib/errors.js'

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Rota não encontrada' })
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    })
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
  if ((err as { code?: string })?.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Registro já existe' })
  console.error(err)
  res.status(500).json({ error: 'Erro interno do servidor' })
}
