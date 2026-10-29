import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Badge, Button, Card, Empty, ErrorBox, Field, Input, Modal, PageHeader, Spinner } from '../components/ui'
import { api, errorMessage } from '../lib/api'
import { brl, dateBR } from '../lib/format'
import type { Customer } from '../lib/types'
import { useAsync } from '../lib/useAsync'

const empty = { name: '', phone: '', email: '' }

export default function Customers() {
  const [q, setQ] = useState('')
  const { data, loading, error, reload } = useAsync(() => api<Customer[]>(`/customers?q=${encodeURIComponent(q)}`), [q])
  const [editing, setEditing] = useState<Customer | 'new' | null>(null)
  const [form, setForm] = useState(empty)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })

  function open(c: Customer | 'new') {
    setEditing(c)
    setFormError(null)
    setForm(c === 'new' ? empty : { name: c.name, phone: c.phone ?? '', email: c.email ?? '' })
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      await (editing === 'new' ? api('/customers', { method: 'POST', body: form }) : api(`/customers/${(editing as Customer).id}`, { method: 'PUT', body: form }))
      setEditing(null)
      await reload()
    } catch (err) {
      setFormError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function remove(c: Customer) {
    if (!confirm(`Excluir o cliente "${c.name}"? As vendas dele continuam registradas, sem cliente.`)) return
    await api(`/customers/${c.id}`, { method: 'DELETE' })
    await reload()
  }

  return (
    <>
      <PageHeader title="Clientes" subtitle={data ? `${data.length} clientes` : undefined} actions={<Button onClick={() => open('new')}><Plus size={16} /> Novo cliente</Button>} />
      <Input className="mb-4 max-w-xs" placeholder="Buscar cliente…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar cliente" />
      <Card>
        {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data?.length ? (
          <Empty>Nenhum cliente encontrado.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="pb-2 font-medium">Cliente</th>
                  <th className="pb-2 font-medium">Contato</th>
                  <th className="pb-2 text-right font-medium">Pedidos</th>
                  <th className="pb-2 text-right font-medium">Total gasto</th>
                  <th className="pb-2 pl-4 font-medium">Última compra</th>
                  <th className="pb-2 pl-4 font-medium">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {data.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 font-medium">{c.name}</td>
                    <td className="py-2.5 text-muted">{c.phone || c.email || '—'}</td>
                    <td className="py-2.5 text-right font-mono">{c.orders}</td>
                    <td className="py-2.5 text-right font-mono">{brl(c.totalSpent)}</td>
                    <td className="py-2.5 pl-4 text-muted">{c.lastPurchase ? dateBR(c.lastPurchase) : '—'}</td>
                    <td className="py-2.5 pl-4"><Badge status={c.status} /></td>
                    <td className="py-2.5 pl-3">
                      <span className="flex justify-end gap-1">
                        <button onClick={() => open(c)} aria-label={`Editar ${c.name}`} className="rounded-lg p-2 text-muted hover:bg-raised hover:text-ink"><Pencil size={15} /></button>
                        <button onClick={() => remove(c)} aria-label={`Excluir ${c.name}`} className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger"><Trash2 size={15} /></button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <p className="mt-3 text-xs text-muted">Recorrente: 10 compras ou mais. Inativo: mais de 30 dias sem comprar.</p>

      {editing && (
        <Modal title={editing === 'new' ? 'Novo cliente' : 'Editar cliente'} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Nome"><Input required minLength={2} value={form.name} onChange={set('name')} /></Field>
            <Field label="Telefone"><Input inputMode="tel" value={form.phone} onChange={set('phone')} /></Field>
            <Field label="E-mail"><Input type="email" value={form.email} onChange={set('email')} /></Field>
            {formError && <ErrorBox message={formError} />}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}
