import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { Button, Card, ErrorBox, Field, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { errorMessage } from '../lib/api'

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAuth()
  const isLogin = mode === 'login'
  const [form, setForm] = useState({ name: '', businessName: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (isLogin) await login(form.email, form.password)
      else await register(form)
    } catch (err) {
      setError(errorMessage(err))
      setLoading(false)
    }
  }

  async function demo() {
    setError(null)
    setLoading(true)
    try {
      await login('demo@controlai.com', 'demo1234')
    } catch (err) {
      setError(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center">
          <Logo size="lg" />
        </Link>
        <Card className="p-7">
          <h1 className="font-display text-xl font-bold">{isLogin ? 'Entrar no painel' : 'Criar conta'}</h1>
          <p className="mb-6 mt-1 text-sm text-muted">{isLogin ? 'Acesse o controle do seu negócio.' : 'Cada conta representa um negócio.'}</p>
          <form onSubmit={submit} className="space-y-4">
            {!isLogin && (
              <>
                <Field label="Seu nome">
                  <Input required minLength={2} value={form.name} onChange={set('name')} autoComplete="name" />
                </Field>
                <Field label="Nome do negócio">
                  <Input required minLength={2} value={form.businessName} onChange={set('businessName')} />
                </Field>
              </>
            )}
            <Field label="E-mail">
              <Input type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
            </Field>
            <Field label="Senha">
              <Input type="password" required minLength={isLogin ? 1 : 6} value={form.password} onChange={set('password')} autoComplete={isLogin ? 'current-password' : 'new-password'} />
            </Field>
            {error && <ErrorBox message={error} />}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Aguarde…' : isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>
          {isLogin && (
            <Button variant="ghost" onClick={demo} disabled={loading} className="mt-3 w-full">
              Entrar com a conta de demonstração
            </Button>
          )}
        </Card>
        <p className="mt-5 text-center text-sm text-muted">
          {isLogin ? 'Ainda não tem conta? ' : 'Já tem conta? '}
          <Link to={isLogin ? '/cadastro' : '/entrar'} className="font-semibold text-brand hover:underline">
            {isLogin ? 'Cadastre-se' : 'Entrar'}
          </Link>
        </p>
      </div>
    </div>
  )
}
