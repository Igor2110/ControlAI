/** Soma dias a uma data 'YYYY-MM-DD' (aritmética em UTC, sem surpresas de fuso). */
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function lastDays(today: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addDays(today, i - (count - 1)))
}

/** Últimos N meses no formato 'YYYY-MM', do mais antigo ao atual. */
export function lastMonths(today: string, count: number): string[] {
  const [y, m] = today.split('-').map(Number)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(y, m - 1 - (count - 1 - i), 1))
    return d.toISOString().slice(0, 7)
  })
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
export const weekdayLabel = (date: string) => WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()]
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
export const monthLabel = (ym: string) => MONTHS[Number(ym.slice(5, 7)) - 1]
