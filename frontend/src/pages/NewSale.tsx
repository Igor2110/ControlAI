import { Minus, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, ErrorBox, Field, Input, PageHeader, Select, Spinner } from '../components/ui'
import { api, errorMessage } from '../lib/api'
import { brl } from '../lib/format'
import type { Customer, PaymentMethod, Product } from '../lib/types'
import { useAsync } from '../lib/useAsync'

export default function NewSale() {
  const navigate = useNavigate()
  const products = useAsync(() => api<Product[]>('/products'))
  const customers = useAsync(() => api<Customer[]>('/customers'))
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [customerId, setCustomerId] = useState('')
  const [payment, setPayment] = useState<PaymentMethod>('pix')
  const [discount, setDiscount] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const byId = useMemo(() => new Map((products.data ?? []).map((p) => [p.id, p])), [products.data])
  const lines = Object.entries(cart).map(([id, qty]) => ({ product: byId.get(Number(id))!, qty }))
  const subtotal = lines.reduce((a, l) => a + l.product.price * l.qty, 0)
  const disc = Math.min(Math.max(Number(discount.replace(',', '.')) || 0, 0), subtotal)
  const total = subtotal - disc

  const setQty = (p: Product, qty: number) =>
    setCart((c) => {
      const next = { ...c }
      if (qty <= 0) delete next[p.id]
      else next[p.id] = Math.min(qty, p.stock)
      return next
    })

  async function submit() {
    setSaving(true)
    setError(null)
    try {
      await api('/sales', {
        method: 'POST',
        body: {
          customerId: customerId ? Number(customerId) : null,
          paymentMethod: payment,
          discount: disc,
          items: lines.map((l) => ({ productId: l.product.id, quantity: l.qty })),
        },
      })
      navigate('/vendas')
    } catch (e) {
      setError(errorMessage(e))
      setSaving(false)
    }
  }

  if (products.loading || customers.loading) return <Spinner />
  if (products.error) return <ErrorBox message={products.error} onRetry={products.reload} />
  const list = (products.data ?? []).filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <PageHeader title="Nova venda" subtitle="Escolha os produtos e finalize o pedido" />
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Buscar produto…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Buscar produto" />
          </div>
          <ul className="divide-y divide-line/40">
            {list.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted">
                    {brl(p.price)} · {p.stock > 0 ? `${p.stock} em estoque` : 'esgotado'}
                  </p>
                </div>
                <Button variant="ghost" disabled={p.stock === 0 || (cart[p.id] ?? 0) >= p.stock} onClick={() => setQty(p, (cart[p.id] ?? 0) + 1)} aria-label={`Adicionar ${p.name}`}>
                  <Plus size={16} />
                </Button>
              </li>
            ))}
            {list.length === 0 && <li className="py-8 text-center text-sm text-muted">Nenhum produto encontrado.</li>}
          </ul>
        </Card>

        <Card className="h-fit lg:col-span-2">
          <h2 className="mb-4 font-semibold">Pedido</h2>
          {lines.length === 0 ? (
            <p className="mb-4 text-sm text-muted">Nenhum item adicionado.</p>
          ) : (
            <ul className="mb-4 space-y-3">
              {lines.map(({ product: p, qty }) => (
                <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">{p.name}</span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <button onClick={() => setQty(p, qty - 1)} aria-label="Diminuir" className="rounded-md border border-line p-1 hover:bg-raised"><Minus size={14} /></button>
                    <span className="w-6 text-center font-mono">{qty}</span>
                    <button onClick={() => setQty(p, qty + 1)} aria-label="Aumentar" className="rounded-md border border-line p-1 hover:bg-raised"><Plus size={14} /></button>
                    <button onClick={() => setQty(p, 0)} aria-label="Remover" className="ml-1 p-1 text-danger"><Trash2 size={14} /></button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="space-y-3 border-t border-line/60 pt-4">
            <Field label="Cliente (opcional)">
              <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">Sem cliente</option>
                {customers.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Forma de pagamento">
              <Select value={payment} onChange={(e) => setPayment(e.target.value as PaymentMethod)}>
                <option value="pix">Pix</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
              </Select>
            </Field>
            <Field label="Desconto (R$)">
              <Input inputMode="decimal" placeholder="0,00" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </Field>
          </div>
          <dl className="mt-4 space-y-1 border-t border-line/60 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-mono">{brl(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Desconto</dt><dd className="font-mono">− {brl(disc)}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd className="font-mono text-ok">{brl(total)}</dd></div>
          </dl>
          {error && <div className="mt-4"><ErrorBox message={error} /></div>}
          <Button onClick={submit} disabled={saving || lines.length === 0} className="mt-4 w-full">
            {saving ? 'Registrando…' : 'Finalizar venda'}
          </Button>
        </Card>
      </div>
    </>
  )
}
