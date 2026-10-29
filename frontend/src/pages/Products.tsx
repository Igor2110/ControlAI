import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Badge, Button, Card, Empty, ErrorBox, Field, Input, Modal, PageHeader, Select, Spinner } from '../components/ui'
import { api, errorMessage } from '../lib/api'
import { brl } from '../lib/format'
import type { Product } from '../lib/types'
import { useAsync } from '../lib/useAsync'

const empty = { name: '', category: '', price: '', stock: '', minStock: '' }

export default function Products() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const { data, loading, error, reload } = useAsync(() => api<Product[]>(`/products?q=${encodeURIComponent(q)}${status ? `&status=${status}` : ''}`), [q, status])
  const categories = useAsync(() => api<string[]>('/products/categories'), [data?.length])
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [form, setForm] = useState(empty)
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function open(p: Product | 'new') {
    setEditing(p)
    setFormError(null)
    setForm(p === 'new' ? empty : { name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), minStock: String(p.minStock) })
  }
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    const body = { ...form, price: Number(form.price.replace(',', '.')), stock: Number(form.stock), minStock: Number(form.minStock || 0) }
    try {
      await (editing === 'new' ? api('/products', { method: 'POST', body }) : api(`/products/${(editing as Product).id}`, { method: 'PUT', body }))
      setEditing(null)
      await reload()
    } catch (err) {
      setFormError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Excluir "${p.name}"? O histórico de vendas é mantido.`)) return
    await api(`/products/${p.id}`, { method: 'DELETE' })
    await reload()
  }

  return (
    <>
      <PageHeader
        title="Estoque"
        subtitle={data ? `${data.length} produtos` : undefined}
        actions={<Button onClick={() => open('new')}><Plus size={16} /> Novo produto</Button>}
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <Input className="max-w-xs" placeholder="Buscar produto…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar produto" />
        <Select className="max-w-[200px]" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          <option value="ok">Em estoque</option>
          <option value="baixo">Estoque baixo</option>
          <option value="critico">Crítico</option>
          <option value="esgotado">Esgotado</option>
        </Select>
      </div>
      <Card>
        {loading ? <Spinner /> : error ? <ErrorBox message={error} onRetry={reload} /> : !data?.length ? (
          <Empty>Nenhum produto encontrado.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="pb-2 font-medium">Produto</th>
                  <th className="pb-2 font-medium">Categoria</th>
                  <th className="pb-2 text-right font-medium">Preço</th>
                  <th className="pb-2 text-right font-medium">Estoque</th>
                  <th className="pb-2 text-right font-medium">Mínimo</th>
                  <th className="pb-2 pl-4 font-medium">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {data.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5 text-muted">{p.category}</td>
                    <td className="py-2.5 text-right font-mono">{brl(p.price)}</td>
                    <td className="py-2.5 text-right font-mono">{p.stock}</td>
                    <td className="py-2.5 text-right font-mono text-muted">{p.minStock}</td>
                    <td className="py-2.5 pl-4"><Badge status={p.status} /></td>
                    <td className="py-2.5 pl-3">
                      <span className="flex justify-end gap-1">
                        <button onClick={() => open(p)} aria-label={`Editar ${p.name}`} className="rounded-lg p-2 text-muted hover:bg-raised hover:text-ink"><Pencil size={15} /></button>
                        <button onClick={() => remove(p)} aria-label={`Excluir ${p.name}`} className="rounded-lg p-2 text-muted hover:bg-danger/10 hover:text-danger"><Trash2 size={15} /></button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && (
        <Modal title={editing === 'new' ? 'Novo produto' : 'Editar produto'} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Nome"><Input required minLength={2} value={form.name} onChange={set('name')} /></Field>
            <Field label="Categoria">
              <Input required minLength={2} list="cats" value={form.category} onChange={set('category')} />
              <datalist id="cats">{categories.data?.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Preço (R$)"><Input required inputMode="decimal" value={form.price} onChange={set('price')} /></Field>
              <Field label="Estoque"><Input required type="number" min={0} value={form.stock} onChange={set('stock')} /></Field>
              <Field label="Mínimo"><Input type="number" min={0} value={form.minStock} onChange={set('minStock')} /></Field>
            </div>
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
