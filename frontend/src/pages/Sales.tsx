import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Empty, ErrorBox, PageHeader, Select, Spinner } from '../components/ui'
import { api, errorMessage } from '../lib/api'
import { brl, dateTimeBR, paymentLabel } from '../lib/format'
import type { Sale } from '../lib/types'
import { useAsync } from '../lib/useAsync'

export default function Sales() {
  const [status, setStatus] = useState('')
  const { data, loading, error, reload } = useAsync(
    () => api<{ data: Sale[]; total: number }>(`/sales?limit=50${status ? `&status=${status}` : ''}`),
    [status],
  )
  const [actionError, setActionError] = useState<string | null>(null)

  async function cancel(s: Sale) {
    if (!confirm(`Cancelar a venda #${s.id}? Os itens voltam ao estoque e a entrada sai do caixa.`)) return
    setActionError(null)
    try {
      await api(`/sales/${s.id}/cancel`, { method: 'POST' })
      await reload()
    } catch (e) {
      setActionError(errorMessage(e))
    }
  }

  return (
    <>
      <PageHeader
        title="Vendas"
        subtitle={data ? `${data.total} vendas encontradas` : undefined}
        actions={
          <Link to="/vendas/nova">
            <Button>
              <Plus size={16} /> Nova venda
            </Button>
          </Link>
        }
      />
      <div className="mb-4 max-w-[200px]">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          <option value="concluida">Concluídas</option>
          <option value="cancelada">Canceladas</option>
        </Select>
      </div>
      {actionError && <div className="mb-4"><ErrorBox message={actionError} /></div>}
      <Card>
        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorBox message={error} onRetry={reload} />
        ) : !data?.data.length ? (
          <Empty>Nenhuma venda ainda. Registre a primeira em “Nova venda”.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="pb-2 font-medium">Pedido</th>
                  <th className="pb-2 font-medium">Cliente</th>
                  <th className="pb-2 font-medium">Data</th>
                  <th className="pb-2 font-medium">Itens</th>
                  <th className="pb-2 font-medium">Pagamento</th>
                  <th className="pb-2 text-right font-medium">Valor</th>
                  <th className="pb-2 pl-4 font-medium">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {data.data.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 font-mono text-muted">#{s.id}</td>
                    <td className="py-2.5">{s.customerName ?? 'Sem cliente'}</td>
                    <td className="py-2.5 text-muted">{dateTimeBR(s.createdAt)}</td>
                    <td className="py-2.5">{s.itemsCount}</td>
                    <td className="py-2.5">{paymentLabel[s.paymentMethod]}</td>
                    <td className="py-2.5 text-right font-mono">{brl(s.total)}</td>
                    <td className="py-2.5 pl-4">
                      <Badge status={s.status} />
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      {s.status === 'concluida' && (
                        <button onClick={() => cancel(s)} className="text-xs font-semibold text-danger hover:underline">
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}
