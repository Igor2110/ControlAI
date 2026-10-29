import { X } from 'lucide-react'
import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line/60 bg-panel p-5 ${className}`}>{children}</section>
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }
export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-brand-dark text-white hover:bg-brand',
    ghost: 'border border-line text-ink hover:bg-raised',
    danger: 'border border-danger/40 text-danger hover:bg-danger/10',
  }[variant]
  return (
    <button
      {...props}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    />
  )
}

const control = 'w-full min-h-10 rounded-xl border border-line bg-bg px-3 text-sm text-ink placeholder:text-muted/70 focus:border-brand'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  )
}
export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`${control} ${props.className ?? ''}`} />
export const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => <select {...props} className={`${control} ${props.className ?? ''}`} />

const badgeStyles: Record<string, string> = {
  ok: 'bg-ok/15 text-ok',
  concluida: 'bg-ok/15 text-ok',
  ativo: 'bg-ok/15 text-ok',
  entrada: 'bg-ok/15 text-ok',
  baixo: 'bg-warn/15 text-warn',
  recorrente: 'bg-brand/15 text-brand',
  critico: 'bg-danger/15 text-danger',
  esgotado: 'bg-danger/15 text-danger',
  cancelada: 'bg-danger/15 text-danger',
  saida: 'bg-danger/15 text-danger',
  inativo: 'bg-muted/15 text-muted',
}
const badgeLabels: Record<string, string> = {
  ok: 'Em estoque',
  baixo: 'Estoque baixo',
  critico: 'Crítico',
  esgotado: 'Esgotado',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  ativo: 'Ativo',
  recorrente: 'Recorrente',
  inativo: 'Inativo',
  entrada: 'Entrada',
  saida: 'Saída',
}
export function Badge({ status }: { status: string }) {
  return (
    <span className={`whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${badgeStyles[status] ?? 'bg-muted/15 text-muted'}`}>
      {badgeLabels[status] ?? status}
    </span>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

export function Spinner() {
  return (
    <div role="status" aria-label="Carregando" className="flex justify-center py-16">
      <div className="size-8 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  )
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
      {message}
      {onRetry && (
        <button onClick={onRetry} className="ml-3 font-semibold underline">
          Tentar de novo
        </button>
      )}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="py-10 text-center text-sm text-muted">{children}</p>
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-panel p-6 sm:rounded-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" className="rounded-lg p-1.5 text-muted hover:bg-raised">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function StatCard({ label, value, hint, tone }: { label: string; value: string; hint?: ReactNode; tone?: 'ok' | 'danger' }) {
  return (
    <Card>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={`mt-2 font-mono text-2xl font-medium ${tone === 'ok' ? 'text-ok' : tone === 'danger' ? 'text-danger' : ''}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  )
}

export const chartTooltip = {
  contentStyle: { background: '#0e2d4d', border: '1px solid #16406a', borderRadius: 12, color: '#f8fafc', fontSize: 13 },
  labelStyle: { color: '#8fa8bf' },
}
