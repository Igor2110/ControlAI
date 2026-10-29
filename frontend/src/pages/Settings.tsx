import { useState, type FormEvent } from 'react'
import { Button, Card, ErrorBox, Field, Input, PageHeader } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { api, errorMessage } from '../lib/api'
import type { User } from '../lib/types'

export default function Settings() {
  const { user, setUser, logout } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [businessName, setBusinessName] = useState(user?.businessName ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    try {
      setUser(await api<User>('/auth/me', { method: 'PUT', body: { name, businessName } }))
      setSaved(true)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <>
      <PageHeader title="Configurações" />
      <Card className="max-w-lg">
        <form onSubmit={save} className="space-y-4">
          <Field label="Seu nome"><Input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Nome do negócio"><Input required minLength={2} value={businessName} onChange={(e) => setBusinessName(e.target.value)} /></Field>
          <Field label="E-mail"><Input value={user?.email ?? ''} disabled /></Field>
          {error && <ErrorBox message={error} />}
          {saved && <p role="status" className="text-sm text-ok">Alterações salvas.</p>}
          <div className="flex gap-2">
            <Button type="submit">Salvar</Button>
            <Button type="button" variant="danger" onClick={logout}>Sair da conta</Button>
          </div>
        </form>
      </Card>
    </>
  )
}
