import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, setUnauthorizedHandler, tokenStore } from '../lib/api'
import type { User } from '../lib/types'

type AuthResponse = { token: string; user: User }
type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; businessName: string; email: string; password: string }) => Promise<void>
  logout: () => void
  setUser: (u: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(!!tokenStore.get())

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    if (!tokenStore.get()) return
    api<User>('/auth/me')
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false))
  }, [logout])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      logout,
      setUser,
      login: async (email, password) => {
        const r = await api<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } })
        tokenStore.set(r.token)
        setUser(r.user)
      },
      register: async (data) => {
        const r = await api<AuthResponse>('/auth/register', { method: 'POST', body: data })
        tokenStore.set(r.token)
        setUser(r.user)
      },
    }),
    [user, loading, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider')
  return ctx
}
