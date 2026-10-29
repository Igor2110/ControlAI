export type User = { id: number; name: string; email: string; businessName: string }
export type StockStatus = 'ok' | 'baixo' | 'critico' | 'esgotado'
export type Product = { id: number; name: string; category: string; price: number; stock: number; minStock: number; status: StockStatus }
export type Customer = {
  id: number
  name: string
  phone: string | null
  email: string | null
  orders: number
  totalSpent: number
  lastPurchase: string | null
  status: 'ativo' | 'recorrente' | 'inativo'
}
export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao'
export type SaleStatus = 'concluida' | 'cancelada'
export type Sale = {
  id: number
  customerId: number | null
  customerName: string | null
  paymentMethod: PaymentMethod
  discount: number
  total: number
  status: SaleStatus
  createdAt: string
  itemsCount: number
}
export type Transaction = { id: number; saleId: number | null; type: 'entrada' | 'saida'; category: string; description: string; amount: number; date: string }
export type DayPoint = { date: string; label: string; vendas: number; pedidos: number }
export type Dashboard = {
  kpis: {
    salesToday: number
    salesTodayVsYesterday: number | null
    ordersToday: number
    salesWeek: number
    salesWeekVsPrevious: number | null
    averageTicket: number
    monthBalance: number
    lowStockCount: number
  }
  series7d: DayPoint[]
  series30d: DayPoint[]
  lowStock: Product[]
  recentSales: { id: number; customerName: string | null; total: number; paymentMethod: PaymentMethod; status: SaleStatus; createdAt: string }[]
}
export type FinanceSummary = {
  currentMonth: { entradas: number; saidas: number; saldo: number }
  monthly: { month: string; label: string; entradas: number; saidas: number }[]
  expensesByCategory: { category: string; total: number }[]
}
export type Insight = { type: 'alerta' | 'dica' | 'info'; title: string; text: string }
