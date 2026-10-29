import { AlertTriangle, Info, Lightbulb } from 'lucide-react'
import { Card, ErrorBox, PageHeader, Spinner } from '../components/ui'
import { api } from '../lib/api'
import type { Insight } from '../lib/types'
import { useAsync } from '../lib/useAsync'

const style = {
  alerta: { icon: AlertTriangle, cls: 'bg-warn/15 text-warn' },
  dica: { icon: Lightbulb, cls: 'bg-brand/15 text-brand' },
  info: { icon: Info, cls: 'bg-ok/15 text-ok' },
}

export default function Assistant() {
  const { data, loading, error, reload } = useAsync(() => api<Insight[]>('/insights'))
  return (
    <>
      <PageHeader title="Assistente" subtitle="Recomendações geradas a partir dos dados reais do seu negócio" />
      {loading ? <Spinner /> : error || !data ? <ErrorBox message={error ?? 'Erro'} onRetry={reload} /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((i, idx) => {
            const { icon: Icon, cls } = style[i.type]
            return (
              <Card key={idx} className="flex gap-4">
                <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${cls}`}><Icon size={20} /></span>
                <div>
                  <h2 className="font-semibold">{i.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{i.text}</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
      <p className="mt-6 text-xs text-muted">As recomendações seguem regras simples (estoque, vendas, caixa e clientes). Não usam inteligência artificial generativa.</p>
    </>
  )
}
