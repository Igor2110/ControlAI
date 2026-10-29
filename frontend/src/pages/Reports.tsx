import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, Empty, ErrorBox, PageHeader, Select, Spinner, chartTooltip } from '../components/ui'
import { api } from '../lib/api'
import { brl, dateBR, num, paymentLabel } from '../lib/format'
import { useAsync } from '../lib/useAsync'

type Period<T> = { from: string; to: string; data: T[] }
const COLORS = ['#2f9bff', '#35d39a', '#f2b84b', '#f06a6a', '#a78bfa']

export default function Reports() {
  const [days, setDays] = useState(30)
  const range = useAsync(async () => {
    const to = new Date()
    const from = new Date(to.getTime() - (days - 1) * 86400000)
    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return `from=${iso(from)}&to=${iso(to)}`
  }, [days])
  const qs = range.data ?? ''
  const cat = useAsync(() => (qs ? api<Period<{ category: string; total: number }>>(`/reports/by-category?${qs}`) : Promise.resolve(null)), [qs])
  const top = useAsync(() => (qs ? api<Period<{ name: string; quantity: number; total: number }>>(`/reports/top-products?${qs}`) : Promise.resolve(null)), [qs])
  const pay = useAsync(() => (qs ? api<Period<{ method: 'pix' | 'dinheiro' | 'cartao'; orders: number; total: number }>>(`/reports/by-payment?${qs}`) : Promise.resolve(null)), [qs])

  const loading = cat.loading || top.loading || pay.loading
  const error = cat.error ?? top.error ?? pay.error

  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle={cat.data ? `${dateBR(cat.data.from)} a ${dateBR(cat.data.to)} · apenas vendas concluídas` : undefined}
        actions={
          <Select value={days} onChange={(e) => setDays(Number(e.target.value))} aria-label="Período">
            <option value={7}>Últimos 7 dias</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={90}>Últimos 90 dias</option>
          </Select>
        }
      />
      {loading ? <Spinner /> : error ? <ErrorBox message={error} /> : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h2 className="mb-4 font-semibold">Vendas por categoria</h2>
            {!cat.data?.data.length ? <Empty>Sem vendas no período.</Empty> : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cat.data.data} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid stroke="#16406a" strokeOpacity={0.4} horizontal={false} />
                    <XAxis type="number" stroke="#8fa8bf" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="category" stroke="#8fa8bf" fontSize={12} tickLine={false} axisLine={false} width={90} />
                    <Tooltip {...chartTooltip} formatter={(v) => brl(Number(v))} cursor={{ fill: '#0e2d4d' }} />
                    <Bar dataKey="total" name="Total" fill="#2f9bff" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
          <Card>
            <h2 className="mb-4 font-semibold">Formas de pagamento</h2>
            {!pay.data?.data.length ? <Empty>Sem vendas no período.</Empty> : (
              <div className="flex flex-wrap items-center gap-6">
                <div className="h-52 w-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pay.data.data} dataKey="total" nameKey="method" innerRadius={50} outerRadius={85} stroke="none">
                        {pay.data.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip {...chartTooltip} formatter={(v) => brl(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-2 text-sm">
                  {pay.data.data.map((p, i) => (
                    <li key={p.method} className="flex items-center gap-2">
                      <span className="size-3 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                      {paymentLabel[p.method]} <span className="font-mono text-muted">{brl(p.total)} · {num(p.orders)} pedidos</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
          <Card className="lg:col-span-2">
            <h2 className="mb-4 font-semibold">Produtos mais vendidos</h2>
            {!top.data?.data.length ? <Empty>Sem vendas no período.</Empty> : (
              <ol className="divide-y divide-line/40">
                {top.data.data.map((p, i) => (
                  <li key={p.name} className="flex items-center gap-4 py-3 text-sm">
                    <span className="w-6 font-mono text-muted">{i + 1}º</span>
                    <span className="flex-1 font-medium">{p.name}</span>
                    <span className="font-mono text-muted">{num(p.quantity)} un.</span>
                    <span className="w-28 text-right font-mono">{brl(p.total)}</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
