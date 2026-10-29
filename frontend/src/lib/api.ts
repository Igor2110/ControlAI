const BASE = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'controlai.token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: { field: string; message: string }[],
  ) {
    super(message)
  }
}

let onUnauthorized: (() => void) | null = null
export const setUnauthorizedHandler = (fn: () => void) => (onUnauthorized = fn)

type Options = { method?: string; body?: unknown }

export async function api<T>(path: string, { method = 'GET', body }: Options = {}): Promise<T> {
  const token = tokenStore.get()
  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor. Verifique se a API está rodando.')
  }
  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && token && !path.startsWith('/auth/login')) onUnauthorized?.()
    throw new ApiError(res.status, data.error ?? 'Erro inesperado', data.details)
  }
  return data as T
}

export const errorMessage = (e: unknown) =>
  e instanceof ApiError ? (e.details?.length ? `${e.message}: ${e.details.map((d) => d.message).join('; ')}` : e.message) : 'Erro inesperado'
