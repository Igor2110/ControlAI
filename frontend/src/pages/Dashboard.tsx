import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Card, ErrorBox, PageHeader, Spinner, StatCard, chartTooltip } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import { brl, dateTimeBR, paymentLabel } from '../lib/format'
import type { Dashboard as DashboardData } from '../lib/types'
import { useAsync } from '../lib/useAsync'

const trend = (v: number | null, suffix: string) => (v === null ? '—' : `${v > 0 ? '+' : ''}${v.toString().replace('.', ',')}% ${suffix}`)

export default function Dashboard() {
  const { user } = useAuth()
  const { data, loading, error, reload } = useAsync(() => api<DashboardData>('/dashboard'))
  const [range, setRange] = useState<'7d' | '30d'>('7d')

  if (loading) return <Spinner />
  if (error || !data) return <ErrorBox message={error ?? 'Erro'} onRetry={reload} />
  const { kpis } = data
  const series = range === '7d' ? data.series7d : data.series30d

  return (
    <>
      <PageHeader title="Visão geral" subtitle={`Resumo de ${user?.businessName}`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Vendas hoje" value={brl(kpis.salesToday)} hint={trend(kpis.salesTodayVsYesterday, 'vs ontem')} />
        <StatCard label="Vendas nos últimos 7 dias" value={brl(kpis.salesWeek)} hint={trend(kpis.salesWeekVsPrevious, 'vs semana anterior')} />
        <StatCard label="Ticket médio (7 dias)" value={brl(kpis.averageTicket)} hint={`${kpis.ordersToday} pedidos hoje`} />
        <StatCard label="Saldo do mês" value={brl(kpis.monthBalance)} tone={kpis.monthBalance >= 0 ? 'ok' : 'danger'} hint="Entradas − saídas" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Vendas</h2>
            <div className="flex rounded-lg border border-line p-0.5 text-xs">
              {(['7d', '30d'] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`rounded-md px-3 py-1 font-medium ${range === r ? 'bg-brand-dark text-white' : 'text-muted'}`}>
                  {r === '7d' ? '7 dias' : '30 dias'}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f9bff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2f9bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#16406a" strokeOpacity={0.4} vertical={false} />
                <XAxis dataKey="label" stroke="#8fa8bf" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8fa8bf" fontSize={12} tickLine={false} axisLine={false} width={50} />
                <Tooltip {...chartTooltip} formatter={(v) => brl(Number(v))} />
                <Area type="monotone" dataKey="vendas" name="Vendas" stroke="#2f9bff" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold">
            <AlertTriangle size={16} className="text-warn" /> Alertas de estoque
          </h2>
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-muted">Nenhum produto abaixo do mínimo.</p>
          ) : (
            <ul className="space-y-3">
              {data.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">{p.name}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-xs text-muted">
                      {p.stock}/{p.minStock}
                    </span>
                    <Badge status={p.status} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/estoque" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
            Ver estoque
          </Link>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Últimas vendas</h2>
          <Link to="/vendas" className="text-sm font-semibold text-brand hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="pb-2 font-medium">Pedido</th>
                <th className="pb-2 font-medium">Cliente</th>
                <th className="pb-2 font-medium">Data</th>
                <th className="pb-2 font-medium">Pagamento</th>
                <th className="pb-2 text-right font-medium">Valor</th>
                <th className="pb-2 pl-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {data.recentSales.map((s) => (
                <tr key={s.id}>
                  <td className="py-2.5 font-mono text-muted">#{s.id}</td>
                  <td className="py-2.5">{s.customerName ?? 'Sem cliente'}</td>
                  <td className="py-2.5 text-muted">{dateTimeBR(s.createdAt)}</td>
                  <td className="py-2.5">{paymentLabel[s.paymentMethod]}</td>
                  <td className="py-2.5 text-right font-mono">{brl(s.total)}</td>
                  <td className="py-2.5 pl-4">
                    <Badge status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}
