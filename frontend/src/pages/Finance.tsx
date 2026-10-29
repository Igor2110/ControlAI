import { Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Button, Card, Empty, ErrorBox, Field, Input, Modal, PageHeader, Select, Spinner, StatCard, chartTooltip } from '../components/ui'
import { api, errorMessage } from '../lib/api'
import { brl, dateBR } from '../lib/format'
import type { FinanceSummary, Transaction } from '../lib/types'
import { useAsync } from '../lib/useAsync'

const empty = { type: 'saida', category: '', description: '', amount: '' }

export default function Finance() {
  const summary = useAsync(() => api<FinanceSummary>('/finance/summary'))
  const [type, setType] = useState('')
  const txs = useAsync(() => api<Transaction[]>(`/finance/transactions?limit=40${type ? `&type=${type}` : ''}`), [type])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value })
  const refresh = () => Promise.all([summary.reload(), txs.reload()])

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      await api('/finance/transactions', { method: 'POST', body: { ...form, amount: Number(form.amount.replace(',', '.')) } })
      setOpen(false)
      setForm(empty)
      await refresh()
    } catch (err) {
      setFormError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function remove(t: Transaction) {
    setActionError(null)
    try {
      await api(`/finance/transactions/${t.id}`, { method: 'DELETE' })
      await refresh()
    } catch (err) {
      setActionError(errorMessage(err))
    }
  }

  const s = summary.data
  return (
    <>
      <PageHeader title="Financeiro" subtitle="Entradas, saídas e fluxo de caixa" actions={<Button onClick={() => setOpen(true)}><Plus size={16} /> Novo lançamento</Button>} />
      {summary.loading ? <Spinner /> : summary.error || !s ? <ErrorBox message={summary.error ?? 'Erro'} onRetry={summary.reload} /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Entradas do mês" value={brl(s.currentMonth.entradas)} tone="ok" />
            <StatCard label="Saídas do mês" value={brl(s.currentMonth.saidas)} tone="danger" />
            <StatCard label="Saldo do mês" value={brl(s.currentMonth.saldo)} tone={s.currentMonth.saldo >= 0 ? 'ok' : 'danger'} />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <h2 className="mb-4 font-semibold">Últimos 6 meses</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s.monthly} barGap={4}>
                    <CartesianGrid stroke="#16406a" strokeOpacity={0.4} vertical={false} />
                    <XAxis dataKey="label" stroke="#8fa8bf" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8fa8bf" fontSize={12} tickLine={false} axisLine={false} width={50} />
                    <Tooltip {...chartTooltip} formatter={(v) => brl(Number(v))} cursor={{ fill: '#0e2d4d' }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="entradas" name="Entradas" fill="#35d39a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="saidas" name="Saídas" fill="#f06a6a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <h2 className="mb-4 font-semibold">Despesas do mês</h2>
              {s.expensesByCategory.length === 0 ? <p className="text-sm text-muted">Sem despesas neste mês.</p> : (
                <ul className="space-y-3 text-sm">
                  {s.expensesByCategory.map((c) => (
                    <li key={c.category} className="flex justify-between gap-2"><span>{c.category}</span><span className="font-mono">{brl(c.total)}</span></li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}

      <Card className="mt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold">Lançamentos</h2>
          <Select className="max-w-[170px]" value={type} onChange={(e) => setType(e.target.value)} aria-label="Filtrar por tipo">
            <option value="">Todos</option>
            <option value="entrada">Entradas</option>
            <option value="saida">Saídas</option>
          </Select>
        </div>
        {actionError && <div className="mb-3"><ErrorBox message={actionError} /></div>}
        {txs.loading ? <Spinner /> : !txs.data?.length ? <Empty>Nenhum lançamento.</Empty> : (
          <ul className="divide-y divide-line/40">
            {txs.data.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{t.description}</p>
                  <p className="text-xs text-muted">{t.category} · {dateBR(t.date)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge status={t.type} />
                  <span className={`w-28 text-right font-mono ${t.type === 'entrada' ? 'text-ok' : 'text-danger'}`}>{t.type === 'entrada' ? '+' : '−'} {brl(t.amount)}</span>
                  {!t.saleId ? <button onClick={() => remove(t)} aria-label="Excluir lançamento" className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger"><Trash2 size={15} /></button> : <span className="w-9" />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {open && (
        <Modal title="Novo lançamento" onClose={() => setOpen(false)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Tipo">
              <Select value={form.type} onChange={set('type')}>
                <option value="saida">Saída (despesa)</option>
                <option value="entrada">Entrada (receita)</option>
              </Select>
            </Field>
            <Field label="Descrição"><Input required minLength={2} value={form.description} onChange={set('description')} placeholder="Ex.: Aluguel de novembro" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Categoria"><Input required minLength={2} value={form.category} onChange={set('category')} placeholder="Ex.: Despesas fixas" /></Field>
              <Field label="Valor (R$)"><Input required inputMode="decimal" value={form.amount} onChange={set('amount')} /></Field>
            </div>
            {formError && <ErrorBox message={formError} />}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
