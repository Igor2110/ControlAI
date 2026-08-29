import LandingPage from './LandingPage'
import { useState, useRef, useEffect } from 'react'
import { useIsMobile } from './useIsMobile'
import logoImg from './imports/ChatGPT_Image_19_de_ago._de_2026__23_40_02.png'
import {
  LayoutDashboard, ShoppingCart, Package, DollarSign, Users, BarChart2,
  Settings, HelpCircle, Search, Bell, Plus, ArrowUpRight, ArrowDownRight,
  AlertTriangle, CheckCircle, Clock, ChevronRight, X, MessageCircle,
  LogIn, Eye, EyeOff, TrendingUp, Truck, FileText, Download,
  Filter, MoreHorizontal, RefreshCw, Zap, Phone, Send, Menu, ChevronLeft,
  CreditCard, Banknote, Smartphone, Star, RotateCcw, Bot, Sparkles, Lightbulb, TrendingDown
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Screen = 'landing' | 'login' | 'dashboard' | 'vendas' | 'nova-venda' | 'estoque' |
  'add-produto' | 'financeiro' | 'clientes' | 'relatorios' | 'atendimento' | 'configuracoes' | 'ia-assistente'

// ─── DATA ────────────────────────────────────────────────────────────────────
const salesData7d = [
  { day: 'Seg', vendas: 1820, pedidos: 24, ticket: 75.8 },
  { day: 'Ter', vendas: 2340, pedidos: 31, ticket: 75.5 },
  { day: 'Qua', vendas: 1960, pedidos: 26, ticket: 75.4 },
  { day: 'Qui', vendas: 2780, pedidos: 37, ticket: 75.1 },
  { day: 'Sex', vendas: 3120, pedidos: 41, ticket: 76.1 },
  { day: 'Sáb', vendas: 2540, pedidos: 33, ticket: 77.0 },
  { day: 'Dom', vendas: 2840, pedidos: 38, ticket: 74.7 },
]

const salesData30d = [
  { day: '1', vendas: 1200 }, { day: '5', vendas: 2100 }, { day: '10', vendas: 1800 },
  { day: '15', vendas: 2600 }, { day: '20', vendas: 2200 }, { day: '25', vendas: 3100 }, { day: '30', vendas: 2840 },
]

const financeData = [
  { mes: 'Mar', entradas: 12400, saidas: 8200 },
  { mes: 'Abr', entradas: 15600, saidas: 9800 },
  { mes: 'Mai', entradas: 13200, saidas: 8600 },
  { mes: 'Jun', entradas: 18400, saidas: 11200 },
  { mes: 'Jul', entradas: 16800, saidas: 10400 },
  { mes: 'Ago', entradas: 21200, saidas: 12800 },
]

const orders = [
  { id: '#1048', cliente: 'Carlos Silva', data: 'Hoje 10:32', valor: 185.00, pagamento: 'Pix', status: 'Concluído' },
  { id: '#1047', cliente: 'Ana Souza', data: 'Hoje 09:15', valor: 92.50, pagamento: 'Cartão', status: 'Concluído' },
  { id: '#1046', cliente: 'Pedro Oliveira', data: 'Hoje 08:44', valor: 340.00, pagamento: 'Dinheiro', status: 'Concluído' },
  { id: '#1045', cliente: 'Maria Lima', data: 'Ontem 18:20', valor: 78.00, pagamento: 'Pix', status: 'Cancelado' },
  { id: '#1044', cliente: 'Lucas Costa', data: 'Ontem 16:05', valor: 215.00, pagamento: 'Cartão', status: 'Pendente' },
  { id: '#1043', cliente: 'Juliana Ferreira', data: 'Ontem 14:30', valor: 430.00, pagamento: 'Pix', status: 'Concluído' },
]

const stockAlerts = [
  { produto: 'Coca-Cola 350ml', estoque: 4, minimo: 20, status: 'baixo' },
  { produto: 'Hambúrguer artesanal', estoque: 7, minimo: 15, status: 'baixo' },
  { produto: 'Batata frita 2kg', estoque: 2, minimo: 10, status: 'critico' },
  { produto: 'Suco de laranja 1L', estoque: 3, minimo: 12, status: 'critico' },
]

const products = [
  { nome: 'Coca-Cola 350ml', categoria: 'Bebidas', estoque: 4, minimo: 20, preco: 5.50, status: 'baixo' },
  { nome: 'Hambúrguer artesanal', categoria: 'Alimentos', estoque: 7, minimo: 15, preco: 32.00, status: 'baixo' },
  { nome: 'Batata frita 2kg', categoria: 'Alimentos', estoque: 2, minimo: 10, preco: 18.00, status: 'critico' },
  { nome: 'Água mineral 500ml', categoria: 'Bebidas', estoque: 48, minimo: 30, preco: 2.50, status: 'ok' },
  { nome: 'Refrigerante Guaraná', categoria: 'Bebidas', estoque: 22, minimo: 15, preco: 6.00, status: 'ok' },
  { nome: 'Queijo prato kg', categoria: 'Laticínios', estoque: 0, minimo: 5, preco: 45.00, status: 'esgotado' },
  { nome: 'Pão de hambúrguer', categoria: 'Padaria', estoque: 18, minimo: 20, preco: 1.20, status: 'baixo' },
  { nome: 'Maionese 500g', categoria: 'Condimentos', estoque: 9, minimo: 8, preco: 14.00, status: 'ok' },
]

const clients = [
  { nome: 'Carlos Silva', contato: '(11) 99234-5678', ultimaCompra: 'Hoje', totalGasto: 2340.00, pedidos: 18, status: 'ativo' },
  { nome: 'Ana Souza', contato: '(11) 98765-4321', ultimaCompra: 'Ontem', totalGasto: 1850.00, pedidos: 12, status: 'ativo' },
  { nome: 'Pedro Oliveira', contato: '(21) 97654-3210', ultimaCompra: '15 ago', totalGasto: 4200.00, pedidos: 31, status: 'recorrente' },
  { nome: 'Maria Lima', contato: '(31) 96543-2109', ultimaCompra: '12 ago', totalGasto: 780.00, pedidos: 6, status: 'ativo' },
  { nome: 'Lucas Costa', contato: '(11) 95432-1098', ultimaCompra: '10 ago', totalGasto: 1120.00, pedidos: 9, status: 'ativo' },
  { nome: 'Juliana Ferreira', contato: '(41) 94321-0987', ultimaCompra: '8 ago', totalGasto: 6780.00, pedidos: 48, status: 'recorrente' },
]

const cashFlow = [
  { descricao: 'Venda #1048 - Carlos Silva', categoria: 'Vendas', data: 'Hoje 10:32', valor: 185.00, tipo: 'entrada' },
  { descricao: 'Fornecedor - Bebidas Ltda', categoria: 'Compras', data: 'Hoje 09:00', valor: -320.00, tipo: 'saida' },
  { descricao: 'Venda #1047 - Ana Souza', categoria: 'Vendas', data: 'Hoje 09:15', valor: 92.50, tipo: 'entrada' },
  { descricao: 'Venda #1046 - Pedro Oliveira', categoria: 'Vendas', data: 'Hoje 08:44', valor: 340.00, tipo: 'entrada' },
  { descricao: 'Aluguel agosto', categoria: 'Despesas fixas', data: 'Ontem', valor: -1800.00, tipo: 'saida' },
  { descricao: 'Venda #1044 - Lucas Costa', categoria: 'Vendas', data: 'Ontem 16:05', valor: 215.00, tipo: 'entrada' },
]

const conversations = [
  { nome: 'Carlos Silva', msg: 'Oi, quero pedir 2 hambúrgueres e...', hora: '10:32', unread: 2, online: true },
  { nome: 'Ana Souza', msg: 'Você tem Coca-Cola gelada?', hora: '09:15', unread: 0, online: false },
  { nome: 'Pedro Oliveira', msg: 'Qual o horário de funcionamento?', hora: 'Ontem', unread: 1, online: false },
  { nome: 'Maria Lima', msg: 'Ok, obrigada!', hora: 'Ontem', unread: 0, online: false },
]

const chatMessages = [
  { from: 'client', text: 'Oi, quero fazer um pedido!', hora: '10:28' },
  { from: 'client', text: '2 hambúrgueres artesanais e 2 Coca-Cola 350ml', hora: '10:29' },
  { from: 'system', text: '🤖 Pedido identificado: #1048\n• 2x Hambúrguer artesanal R$ 64,00\n• 2x Coca-Cola 350ml R$ 11,00\nTotal: R$ 75,00', hora: '10:30' },
  { from: 'me', text: 'Seu pedido foi confirmado! Tempo estimado: 25 min 🍔', hora: '10:32' },
]

const catalogItems = [
  { id: 1, nome: 'Hambúrguer artesanal', preco: 32.00, categoria: 'Alimentos', estoque: 7 },
  { id: 2, nome: 'Batata frita 2kg', preco: 18.00, categoria: 'Alimentos', estoque: 2 },
  { id: 3, nome: 'Coca-Cola 350ml', preco: 5.50, categoria: 'Bebidas', estoque: 4 },
  { id: 4, nome: 'Água mineral 500ml', preco: 2.50, categoria: 'Bebidas', estoque: 48 },
  { id: 5, nome: 'Suco de laranja 1L', preco: 12.00, categoria: 'Bebidas', estoque: 3 },
]

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#071A2F',
  panel: '#0A223D',
  raised: '#0E2D4D',
  // primary interactive — blue
  amber: '#2F9BFF',
  // positive indicators only — green
  teal: '#35D39A',
  red: '#F06A6A',
  text: '#F8FAFC',
  muted: '#8FA8BF',
  border: 'rgba(47,155,255,0.1)',
  borderMed: 'rgba(47,155,255,0.18)',
  blue: '#1677D2',
  highlight: '#2F9BFF',
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    'Concluído': { label: 'Concluído', color: C.teal, bg: 'rgba(53,211,154,0.12)' },
    'Pendente': { label: 'Pendente', color: C.amber, bg: 'rgba(47,155,255,0.12)' },
    'Cancelado': { label: 'Cancelado', color: C.red, bg: 'rgba(240,106,106,0.12)' },
    'ok': { label: 'Em estoque', color: C.teal, bg: 'rgba(53,211,154,0.12)' },
    'baixo': { label: 'Estoque baixo', color: C.amber, bg: 'rgba(47,155,255,0.12)' },
    'critico': { label: 'Crítico', color: C.red, bg: 'rgba(240,106,106,0.12)' },
    'esgotado': { label: 'Esgotado', color: C.red, bg: 'rgba(240,106,106,0.15)' },
    'ativo': { label: 'Ativo', color: C.teal, bg: 'rgba(53,211,154,0.12)' },
    'recorrente': { label: 'Recorrente', color: C.amber, bg: 'rgba(47,155,255,0.12)' },
  }
  const s = map[status] ?? { label: status, color: C.muted, bg: 'rgba(143,168,191,0.12)' }
  return (
    <span style={{
      color: s.color, background: s.bg, border: `1px solid ${s.color}22`,
      borderRadius: 6, padding: '2px 8px', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap'
    }}>
      {s.label}
    </span>
  )
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, ...style
    }}>
      {children}
    </div>
  )
}

function Btn({
  children, variant = 'primary', onClick, size = 'md', full = false, disabled = false
}: {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger' | 'teal' | 'outline'
  onClick?: () => void
  size?: 'sm' | 'md'
  full?: boolean
  disabled?: boolean
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: C.amber,                        color: '#071A2F',  fontWeight: 600, border: '1px solid transparent' },
    ghost:   { background: C.raised,                       color: C.text,                      border: `1px solid ${C.border}` },
    danger:  { background: 'rgba(240,106,106,0.15)',        color: C.red,                       border: '1px solid rgba(240,106,106,0.3)' },
    teal:    { background: 'rgba(53,211,154,0.15)',         color: C.teal,                      border: '1px solid rgba(53,211,154,0.3)' },
    outline: { background: 'transparent',                  color: C.text,                      border: `1px solid ${C.border}` },
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        borderRadius: 8,
        padding: size === 'sm' ? '6px 14px' : '9px 18px',
        fontSize: size === 'sm' ? 13 : 14,
        fontFamily: 'Inter, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        whiteSpace: 'nowrap',
        opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : undefined,
        justifyContent: full ? 'center' : undefined,
      }}
    >
      {children}
    </button>
  )
}

function Input({
  placeholder, value, onChange, type = 'text', icon
}: {
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
  type?: string
  icon?: React.ReactNode
}) {
  return (
    <div style={{ position: 'relative' }}>
      {icon && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }}>
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        style={{
          background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: icon ? '9px 12px 9px 36px' : '9px 12px',
          color: C.text, fontSize: 14, outline: 'none', width: '100%',
          fontFamily: 'Inter, sans-serif',
        }}
      />
    </div>
  )
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const W = 80, H = 32, pad = 2
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2)
    const y = H - pad - ((v - min) / range) * (H - pad * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8,
      padding: '10px 14px', fontSize: 13
    }}>
      <p style={{ color: C.muted, marginBottom: 4, fontFamily: 'Inter' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 100 ? `R$ ${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const navItems = [
  { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
  { id: 'estoque', label: 'Estoque', icon: Package },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart2 },
  { id: 'atendimento', label: 'Atendimento', icon: MessageCircle },
  { id: 'ia-assistente', label: 'IA Assistente', icon: Bot, highlight: true },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
]

function BottomNav({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const items = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'ia-assistente', label: 'IA', icon: Bot },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'configuracoes', label: 'Config', icon: Settings },
  ]
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: C.panel, borderTop: `1px solid ${C.border}`,
      display: 'flex', height: 60,
    }}>
      {items.map(({ id, label, icon: Icon }) => {
        const active = screen === id || (id === 'dashboard' && !items.find(i => i.id === screen))
        return (
          <button key={id} onClick={() => setScreen(id as Screen)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3, background: 'none',
            borderTop: `2px solid ${active ? C.amber : 'transparent'}`,
            borderLeft: 'none', borderRight: 'none', borderBottom: 'none',
            color: active ? C.amber : C.muted, cursor: 'pointer',
            fontFamily: 'Inter', fontSize: 10, fontWeight: active ? 600 : 400,
          }}>
            <Icon size={18} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}

function Sidebar({ screen, setScreen, collapsed, setCollapsed }: {
  screen: Screen
  setScreen: (s: Screen) => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}) {
  return (
    <aside style={{
      width: collapsed ? 64 : 220, minWidth: collapsed ? 64 : 220,
      background: C.panel, borderRight: `1px solid ${C.border}`,
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'sticky', top: 0,
      transition: 'width 250ms cubic-bezier(0.4,0,0.2,1), min-width 250ms cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '24px 20px', display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between', gap: 8, borderBottom: `1px solid ${C.border}`
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: C.amber,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={16} color="#071A2F" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: C.text }}>
              Controlai
            </span>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: C.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={16} color="#071A2F" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: C.muted,
            display: 'flex', padding: 4
          }}>
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map(({ id, label, icon: Icon, highlight }: any) => {
          const active = screen === id
          return (
            <button
              key={id}
              onClick={() => setScreen(id as Screen)}
              title={collapsed ? label : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 10, padding: collapsed ? '10px 0' : '10px 16px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? 'rgba(47,155,255,0.10)' : highlight && !active ? 'rgba(53,211,154,0.06)' : 'none',
                borderLeft: active ? `2px solid ${C.amber}` : highlight ? `2px solid rgba(53,211,154,0.4)` : '2px solid transparent',
                borderRight: 'none', borderTop: 'none', borderBottom: 'none',
                color: active ? C.amber : highlight ? C.teal : C.muted,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: active ? 500 : 400,
                borderRadius: 0, whiteSpace: 'nowrap',
              }}
            >
              <Icon size={18} />
              {!collapsed && label}
              {!collapsed && highlight && !active && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: C.teal,
                  background: 'rgba(53,211,154,0.12)', border: '1px solid rgba(53,211,154,0.3)',
                  borderRadius: 4, padding: '1px 5px', letterSpacing: '0.05em'
                }}>NOVO</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: collapsed ? '12px 0' : '12px 16px', borderTop: `1px solid ${C.border}` }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${C.highlight}, ${C.teal})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, color: '#071A2F'
            }}>JC</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>João Costa</p>
              <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>Plano Pro ⚡</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: C.raised, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: collapsed ? '8px' : '8px 12px',
            color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter'
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><HelpCircle size={14} /> Ajuda</>}
        </button>
      </div>
    </aside>
  )
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  return (
    <div style={{
      padding: isMobile ? '16px 20px' : '24px 32px', borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, background: C.panel, position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: isMobile ? 18 : 22, fontWeight: 700, margin: 0, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
        {subtitle && !isMobile && <p style={{ margin: '2px 0 0', fontSize: 14, color: C.muted }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flexShrink: 0 }}>
        {!isMobile && actions}
        <button style={{
          background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '8px', cursor: 'pointer', color: C.muted, display: 'flex', position: 'relative'
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 7, height: 7,
            borderRadius: '50%', background: C.amber, border: `1.5px solid ${C.panel}`
          }} />
        </button>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.highlight}, ${C.teal})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: '#071A2F', cursor: 'pointer'
        }}>JC</div>
      </div>
    </div>
  )
}

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, sub, trend, sparkData, color }: {
  icon: any; label: string; value: string; sub: string
  trend?: number; sparkData?: number[]; color: string
}) {
  const up = (trend ?? 0) >= 0
  return (
    <Card style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color={color} />
        </div>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
      <p style={{ margin: '0 0 4px', fontSize: 13, color: C.muted }}>{label}</p>
      <p style={{ margin: '0 0 6px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 22, fontWeight: 600, color: C.text }}>
        {value}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {trend !== undefined && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 3,
            color: up ? C.teal : C.red, fontSize: 12, fontFamily: 'IBM Plex Mono', fontWeight: 500
          }}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
        <span style={{ fontSize: 12, color: C.muted }}>{sub}</span>
      </div>
    </Card>
  )
}

// ─── SCREENS ─────────────────────────────────────────────────────────────────

// LOGIN
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('joao@lanchonete.com.br')
  const [pass, setPass] = useState('senha123')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin() }, 1200)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: C.bg,
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(47,155,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(47,155,255,0.3) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 400, margin: '0 auto', padding: 24
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: C.amber,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
          }}>
            <Zap size={26} color="#071A2F" />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 700, margin: 0, color: C.text }}>
            Controlai
          </h1>
          <p style={{ color: C.muted, margin: '6px 0 0', fontSize: 14 }}>
            Gestão simples para o seu negócio
          </p>
        </div>

        <Card style={{ padding: 28 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 600, margin: '0 0 24px', color: C.text }}>
            Entrar na conta
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>E-mail</label>
              <Input value={email} onChange={setEmail} placeholder="seu@email.com.br" />
            </div>
            <div>
              <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  style={{
                    background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: '9px 40px 9px 12px', color: C.text, fontSize: 14, outline: 'none',
                    width: '100%', fontFamily: 'Inter'
                  }}
                />
                <button onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex'
                }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', marginTop: 24, background: C.amber, color: '#071A2F',
              border: 'none', borderRadius: 8, padding: '11px', fontSize: 15,
              fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'Inter',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Entrando...</> : <><LogIn size={16} /> Entrar</>}
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, margin: '16px 0 0' }}>
            Esqueceu a senha? <span style={{ color: C.amber, cursor: 'pointer' }}>Recuperar</span>
          </p>
        </Card>

        <p style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 24 }}>
          Não tem conta? <span style={{ color: C.amber, cursor: 'pointer' }}>Criar conta grátis</span>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// DASHBOARD
function DashboardScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [salesFilter, setSalesFilter] = useState('7d')
  const isMobile = useIsMobile()
  const chartData = salesFilter === '7d' ? salesData7d : salesData30d
  const pad = isMobile ? '16px 16px' : '28px 32px'

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: isMobile ? 64 : 0 }}>
      <Header
        title="Bom dia, João 👋"
        subtitle="Aqui está o resumo do seu negócio hoje."
        actions={
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
            <input placeholder="Buscar..." style={{
              background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '7px 12px 7px 32px', color: C.text, fontSize: 13, outline: 'none',
              fontFamily: 'Inter', width: 200
            }} />
          </div>
        }
      />

      <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 24 }}>
        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
          <MetricCard
            icon={ShoppingCart} label="Vendas hoje" value="R$ 2.840" sub="vs. ontem"
            trend={12.5} color={C.amber} sparkData={[1820, 2340, 1960, 2780, 3120, 2540, 2840]}
          />
          <MetricCard
            icon={Package} label="Pedidos" value="38" sub="+8 hoje"
            trend={8.3} color={C.teal} sparkData={[24, 31, 26, 37, 41, 33, 38]}
          />
          <MetricCard
            icon={AlertTriangle} label="Estoque" value="124 produtos" sub="7 precisam de reposição"
            color={C.amber} sparkData={[130, 128, 127, 126, 125, 124, 124]}
          />
          <MetricCard
            icon={DollarSign} label="Saldo em caixa" value="R$ 8.420" sub="este mês"
            trend={6.2} color={C.teal} sparkData={[6200, 6800, 7100, 7600, 7900, 8100, 8420]}
          />
        </div>

        {/* Sales chart + stock alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 14 }}>
          {/* Sales chart */}
          <Card style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>Vendas</h3>
                <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                  {[
                    { label: 'Total', value: 'R$ 17.400', color: C.amber },
                    { label: 'Ticket médio', value: 'R$ 75,80', color: C.teal },
                    { label: 'Pedidos', value: '230', color: C.muted },
                  ].map(s => (
                    <div key={s.label}>
                      <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{s.label}</p>
                      <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, fontWeight: 600, color: s.color, margin: 0 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['7d', '30d', '3m', '1a'].map(f => (
                  <button key={f} onClick={() => setSalesFilter(f)} style={{
                    background: salesFilter === f ? C.amber : C.raised,
                    color: salesFilter === f ? '${C.bg}' : C.muted,
                    border: `1px solid ${salesFilter === f ? C.amber : C.border}`,
                    borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter'
                  }}>{f}</button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="amber-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.amber} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={50}
                  tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vendas" name="Vendas" stroke={C.amber} fill="url(#amber-grad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Stock alerts */}
          <Card style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>
                Estoque precisa de atenção
              </h3>
              <AlertTriangle size={16} color={C.amber} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stockAlerts.map(s => (
                <div key={s.produto} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: C.raised, borderRadius: 8,
                  border: `1px solid ${s.status === 'critico' ? 'rgba(240,106,106,0.2)' : 'rgba(47,155,255,0.15)'}`
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: C.text, margin: 0 }}>{s.produto}</p>
                    <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', fontFamily: 'IBM Plex Mono' }}>{s.estoque} un.</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Badge status={s.status} />
                    <Btn variant="ghost" size="sm" onClick={() => setScreen('estoque')}>Repor</Btn>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setScreen('estoque')} style={{
              marginTop: 14, background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '8px', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'Inter',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}>
              Ver estoque completo <ChevronRight size={14} />
            </button>
          </Card>
        </div>

        {/* Recent orders */}
        <Card style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>Pedidos recentes</h3>
            <Btn variant="ghost" size="sm" onClick={() => setScreen('vendas')}>Ver todos <ChevronRight size={13} /></Btn>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Pedido', 'Cliente', 'Data', 'Valor', 'Pagamento', 'Status'].map(col => (
                    <th key={col} style={{
                      textAlign: 'left', padding: '8px 12px', fontSize: 11, color: C.muted,
                      fontWeight: 500, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap'
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.amber }}>{o.id}</td>
                    <td style={{ padding: '12px 12px', fontSize: 13, color: C.text }}>{o.cliente}</td>
                    <td style={{ padding: '12px 12px', fontSize: 13, color: C.muted }}>{o.data}</td>
                    <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.text }}>
                      R$ {o.valor.toFixed(2).replace('.', ',')}
                    </td>
                    <td style={{ padding: '12px 12px', fontSize: 13, color: C.muted }}>{o.pagamento}</td>
                    <td style={{ padding: '12px 12px' }}><Badge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

// VENDAS
function VendasScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const [filter, setFilter] = useState('todos')
  const isMobile = useIsMobile()
  const pad = isMobile ? '16px 16px' : '28px 32px'

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: isMobile ? 64 : 0 }}>
      <Header
        title="Vendas"
        subtitle="Gerencie seus pedidos e faturamento"
        actions={<Btn variant="primary" onClick={() => setScreen('nova-venda')}><Plus size={15} /> Nova venda</Btn>}
      />
      <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: isMobile ? 14 : 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
          <MetricCard icon={ShoppingCart} label="Vendas hoje" value="R$ 2.840" sub="+12,5% vs. ontem" trend={12.5} color={C.amber} sparkData={[1820, 2340, 1960, 2780, 3120, 2540, 2840]} />
          <MetricCard icon={TrendingUp} label="Ticket médio" value="R$ 74,73" sub="esta semana" trend={1.8} color={C.teal} sparkData={[72, 75, 74, 76, 75, 77, 74]} />
          <MetricCard icon={Package} label="Pedidos" value="38" sub="+8 hoje" trend={8.3} color={C.amber} sparkData={[24, 31, 26, 37, 41, 33, 38]} />
          <MetricCard icon={DollarSign} label="Faturamento" value="R$ 17.400" sub="esta semana" trend={6.2} color={C.teal} sparkData={[12000, 14000, 13500, 15000, 16000, 17000, 17400]} />
        </div>

        <Card style={{ padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, margin: 0, color: C.text }}>Pedidos</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {['todos', 'concluído', 'pendente', 'cancelado'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  background: filter === f ? C.raised : 'none',
                  border: `1px solid ${filter === f ? C.border : 'transparent'}`,
                  borderRadius: 6, padding: '5px 12px', fontSize: 12,
                  color: filter === f ? C.text : C.muted, cursor: 'pointer', fontFamily: 'Inter',
                  textTransform: 'capitalize'
                }}>{f}</button>
              ))}
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Pedido', 'Cliente', 'Data', 'Valor', 'Pagamento', 'Status', ''].map((col, i) => (
                  <th key={i} style={{
                    textAlign: 'left', padding: '8px 12px', fontSize: 11, color: C.muted,
                    fontWeight: 500, borderBottom: `1px solid ${C.border}`
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.filter(o => filter === 'todos' || o.status.toLowerCase() === filter).map(o => (
                <tr key={o.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.amber }}>{o.id}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: C.text }}>{o.cliente}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: C.muted }}>{o.data}</td>
                  <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.text }}>R$ {o.valor.toFixed(2).replace('.', ',')}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: C.muted }}>{o.pagamento}</td>
                  <td style={{ padding: '12px 12px' }}><Badge status={o.status} /></td>
                  <td style={{ padding: '12px 12px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}

// NOVA VENDA
function NovaVendaScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<{ id: number; nome: string; preco: number; qty: number }[]>([])
  const [payment, setPayment] = useState<'pix' | 'dinheiro' | 'cartao'>('pix')
  const [discount, setDiscount] = useState('')
  const [success, setSuccess] = useState(false)

  const filtered = catalogItems.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()))
  const subtotal = cart.reduce((s, i) => s + i.preco * i.qty, 0)
  const discVal = parseFloat(discount) || 0
  const total = Math.max(0, subtotal - discVal)

  function addToCart(item: typeof catalogItems[0]) {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id)
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...item, qty: 1 }]
    })
  }

  function finalize() {
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setCart([]); setScreen('vendas') }, 2500)
  }

  if (success) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'rgba(53,211,154,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
          }}>
            <CheckCircle size={36} color={C.teal} />
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>
            Venda finalizada!
          </h2>
          <p style={{ color: C.muted, margin: '0 0 6px' }}>
            R$ {total.toFixed(2).replace('.', ',')} recebido via {payment === 'pix' ? 'Pix' : payment === 'dinheiro' ? 'Dinheiro' : 'Cartão'}
          </p>
          <p style={{ color: C.teal, fontSize: 13 }}>
            <RefreshCw size={12} style={{ display: 'inline', marginRight: 4 }} />
            Estoque atualizado automaticamente
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: isMobile ? 64 : 0 }}>
      <Header title="Nova venda" subtitle="Adicione produtos e finalize o pedido" />
      <div style={{ padding: isMobile ? '16px' : '28px 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 360px', gap: isMobile ? 14 : 24 }}>
        {/* Product search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: '20px 22px' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, margin: '0 0 14px', color: C.text }}>
              Adicionar produtos
            </h3>
            <Input placeholder="Buscar produto..." value={search} onChange={setSearch} icon={<Search size={14} />} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {filtered.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', background: C.raised, borderRadius: 8,
                  border: `1px solid ${C.border}`
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: C.text, margin: 0 }}>{p.nome}</p>
                    <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>
                      {p.categoria} · {p.estoque} em estoque
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, fontWeight: 600, color: C.amber }}>
                      R$ {p.preco.toFixed(2).replace('.', ',')}
                    </span>
                    <button onClick={() => addToCart(p)} style={{
                      width: 30, height: 30, borderRadius: 8, background: C.amber,
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Plus size={16} color="#071A2F" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Cart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: '20px 22px' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, margin: '0 0 14px', color: C.text }}>
              Carrinho {cart.length > 0 && `(${cart.length})`}
            </h3>
            {cart.length === 0 ? (
              <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                Nenhum produto adicionado
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: `1px solid ${C.border}`
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: C.text, margin: 0 }}>{item.nome}</p>
                      <p style={{ fontSize: 12, color: C.muted, margin: '1px 0 0', fontFamily: 'IBM Plex Mono' }}>
                        R$ {item.preco.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => setCart(c => c.map(i => i.id === item.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i).filter(i => !(i.id === item.id && i.qty <= 0)))}
                        style={{ width: 24, height: 24, borderRadius: 6, background: C.raised, border: `1px solid ${C.border}`, cursor: 'pointer', color: C.muted, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.text, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => addToCart({ ...item, estoque: 99, categoria: '' })}
                        style={{ width: 24, height: 24, borderRadius: 6, background: C.raised, border: `1px solid ${C.border}`, cursor: 'pointer', color: C.muted, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      <button onClick={() => setCart(c => c.filter(i => i.id !== item.id))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.red, display: 'flex', marginLeft: 4 }}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: C.muted }}>Subtotal</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.text }}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: C.muted }}>Desconto</span>
                <input
                  placeholder="R$ 0,00"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  style={{
                    background: C.raised, border: `1px solid ${C.border}`, borderRadius: 6,
                    padding: '4px 8px', width: 80, textAlign: 'right', color: C.teal,
                    fontFamily: 'IBM Plex Mono', fontSize: 13, outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: 'Space Grotesk' }}>Total</span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 18, fontWeight: 600, color: C.amber }}>
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Forma de pagamento</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {([
                  { id: 'pix', label: 'Pix', icon: Smartphone },
                  { id: 'dinheiro', label: 'Dinheiro', icon: Banknote },
                  { id: 'cartao', label: 'Cartão', icon: CreditCard },
                ] as const).map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setPayment(id)} style={{
                    padding: '10px 6px', borderRadius: 8,
                    background: payment === id ? 'rgba(47,155,255,0.12)' : C.raised,
                    border: `1px solid ${payment === id ? C.amber : C.border}`,
                    color: payment === id ? C.amber : C.muted,
                    cursor: 'pointer', fontSize: 12, fontFamily: 'Inter',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                  }}>
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={finalize}
              disabled={cart.length === 0}
              style={{
                width: '100%', marginTop: 16, background: cart.length === 0 ? C.raised : C.amber,
                color: cart.length === 0 ? C.muted : '${C.bg}',
                border: 'none', borderRadius: 8, padding: '12px', fontSize: 15,
                fontWeight: 600, cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              <CheckCircle size={16} /> Finalizar venda
            </button>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ESTOQUE
function EstoqueScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('Todos')
  const cats = ['Todos', ...Array.from(new Set(products.map(p => p.categoria)))]
  const filtered = products.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) &&
    (catFilter === 'Todos' || p.categoria === catFilter)
  )

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: isMobile ? 64 : 0 }}>
      <Header
        title="Estoque"
        subtitle="Gerencie seus produtos e reposições"
        actions={<Btn variant="primary" onClick={() => setScreen('add-produto')}><Plus size={15} />{isMobile ? '' : ' Adicionar'}</Btn>}
      />
      <div style={{ padding: isMobile ? '16px' : '28px 32px', display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 8 : 12 }}>
          {[
            { label: 'Total', value: products.length, color: C.teal },
            { label: 'Em estoque', value: products.filter(p => p.status === 'ok').length, color: C.teal },
            { label: 'Estoque baixo', value: products.filter(p => p.status === 'baixo').length, color: C.amber },
            { label: 'Esgotados', value: products.filter(p => p.status === 'esgotado').length, color: C.red },
          ].map(s => (
            <Card key={s.label} style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 24, fontWeight: 600, color: s.color }}>{s.value}</span>
              <span style={{ fontSize: 13, color: C.muted }}>{s.label}</span>
            </Card>
          ))}
        </div>

        <Card style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input placeholder="Buscar produto..." value={search} onChange={setSearch} icon={<Search size={14} />} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} style={{
                  background: catFilter === c ? C.raised : 'none',
                  border: `1px solid ${catFilter === c ? C.border : 'transparent'}`,
                  borderRadius: 6, padding: '6px 12px', fontSize: 12,
                  color: catFilter === c ? C.text : C.muted, cursor: 'pointer', fontFamily: 'Inter'
                }}>{c}</button>
              ))}
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Produto', 'Categoria', 'Estoque', 'Mínimo', 'Preço', 'Valor total', 'Status', ''].map((col, i) => (
                  <th key={i} style={{
                    textAlign: 'left', padding: '8px 12px', fontSize: 11, color: C.muted,
                    fontWeight: 500, borderBottom: `1px solid ${C.border}`
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.nome} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 500, color: C.text }}>{p.nome}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: C.muted }}>{p.categoria}</td>
                  <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: p.status === 'esgotado' ? C.red : p.status === 'critico' || p.status === 'baixo' ? C.amber : C.teal }}>
                    {p.estoque} un.
                  </td>
                  <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.muted }}>{p.minimo} un.</td>
                  <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.text }}>R$ {p.preco.toFixed(2).replace('.', ',')}</td>
                  <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.text }}>R$ {(p.estoque * p.preco).toFixed(2).replace('.', ',')}</td>
                  <td style={{ padding: '12px 12px' }}><Badge status={p.status} /></td>
                  <td style={{ padding: '12px 12px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex' }}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}

// ADD PRODUTO
function AddProdutoScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ nome: '', categoria: '', preco: '', estoque: '', minimo: '' })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => { setSaved(false); setScreen('estoque') }, 1800)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: isMobile ? 64 : 0 }}>
      <Header title="Adicionar produto" subtitle="Preencha os dados do novo produto" />
      <div style={{ padding: isMobile ? '16px' : '28px 32px', maxWidth: 600 }}>
        {saved ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'rgba(53,211,154,0.12)', border: `1px solid rgba(53,211,154,0.3)`, borderRadius: 10 }}>
            <CheckCircle size={20} color={C.teal} />
            <span style={{ color: C.teal, fontSize: 14, fontWeight: 500 }}>Produto adicionado com sucesso!</span>
          </div>
        ) : (
          <Card style={{ padding: '28px 30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { label: 'Nome do produto', key: 'nome', placeholder: 'Ex: Coca-Cola 350ml' },
                { label: 'Categoria', key: 'categoria', placeholder: 'Ex: Bebidas' },
                { label: 'Preço de venda (R$)', key: 'preco', placeholder: '0,00' },
                { label: 'Estoque atual', key: 'estoque', placeholder: '0' },
                { label: 'Estoque mínimo', key: 'minimo', placeholder: '0' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <Input
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={v => setForm({ ...form, [f.key]: v })}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                <Btn variant="primary" onClick={handleSave}><CheckCircle size={15} /> Salvar produto</Btn>
                <Btn variant="ghost" onClick={() => setScreen('estoque')}>Cancelar</Btn>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

// FINANCEIRO
function FinanceiroScreen() {
  const isMobile = useIsMobile()
  const pad = isMobile ? '16px' : '28px 32px'
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: isMobile ? 64 : 0 }}>
      <Header title="Financeiro" subtitle="Controle suas entradas, saídas e fluxo de caixa" />
      <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
          <MetricCard icon={ArrowUpRight} label="Entradas" value="R$ 21.200" sub="este mês" trend={14.2} color={C.teal} sparkData={[12400, 15600, 13200, 18400, 16800, 21200, 21200]} />
          <MetricCard icon={ArrowDownRight} label="Saídas" value="R$ 12.800" sub="este mês" trend={-4.3} color={C.red} sparkData={[8200, 9800, 8600, 11200, 10400, 12800, 12800]} />
          <MetricCard icon={TrendingUp} label="Lucro" value="R$ 8.400" sub="este mês" trend={22.4} color={C.amber} sparkData={[4200, 5800, 4600, 7200, 6400, 8400, 8400]} />
          <MetricCard icon={Clock} label="A receber" value="R$ 3.240" sub="em aberto" color={C.amber} sparkData={[2100, 2800, 2400, 3100, 2900, 3240, 3240]} />
        </div>

        {/* Chart */}
        <Card style={{ padding: '22px 24px' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, margin: '0 0 20px', color: C.text }}>
            Entradas × Saídas
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={financeData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={60}
                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: C.muted }} />
              <Bar dataKey="entradas" name="Entradas" fill={C.teal} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              <Bar dataKey="saidas" name="Saídas" fill={C.red} radius={[4, 4, 0, 0]} fillOpacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Cash flow */}
        <Card style={{ padding: '22px 24px' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, margin: '0 0 18px', color: C.text }}>
            Fluxo de caixa
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Descrição', 'Categoria', 'Data', 'Valor'].map(col => (
                  <th key={col} style={{
                    textAlign: 'left', padding: '8px 12px', fontSize: 11, color: C.muted,
                    fontWeight: 500, borderBottom: `1px solid ${C.border}`
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cashFlow.map((cf, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '11px 12px', fontSize: 13, color: C.text }}>{cf.descricao}</td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: C.muted }}>{cf.categoria}</td>
                  <td style={{ padding: '11px 12px', fontSize: 12, color: C.muted }}>{cf.data}</td>
                  <td style={{ padding: '11px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 600, color: cf.tipo === 'entrada' ? C.teal : C.red }}>
                    {cf.tipo === 'entrada' ? '+' : ''}R$ {Math.abs(cf.valor).toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}

// CLIENTES
function ClientesScreen() {
  const isMobile = useIsMobile()
  const pad = isMobile ? '16px' : '28px 32px'
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: isMobile ? 64 : 0 }}>
      <Header title="Clientes" subtitle="Gerencie e conheça seus clientes" actions={
        <Btn variant="primary"><Plus size={15} />{!isMobile && ' Novo cliente'}</Btn>
      } />
      <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
          <MetricCard icon={Users} label="Total de clientes" value="284" sub="cadastrados" trend={8.2} color={C.teal} sparkData={[240, 248, 255, 260, 268, 276, 284]} />
          <MetricCard icon={Plus} label="Novos clientes" value="18" sub="este mês" trend={12.5} color={C.amber} sparkData={[10, 12, 14, 13, 16, 17, 18]} />
          <MetricCard icon={Star} label="Recorrentes" value="67" sub="voltaram este mês" trend={5.0} color={C.amber} sparkData={[55, 58, 60, 62, 64, 66, 67]} />
          <MetricCard icon={DollarSign} label="Ticket médio" value="R$ 148" sub="por cliente" trend={3.1} color={C.teal} sparkData={[128, 132, 138, 140, 144, 146, 148]} />
        </div>
        <Card style={{ padding: '22px 24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Cliente', 'Contato', 'Última compra', 'Total gasto', 'Pedidos', 'Status'].map(col => (
                  <th key={col} style={{
                    textAlign: 'left', padding: '8px 12px', fontSize: 11, color: C.muted,
                    fontWeight: 500, borderBottom: `1px solid ${C.border}`
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.nome} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: `rgba(${c.status === 'recorrente' ? '232,163,61' : '52,217,180'},0.15)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: c.status === 'recorrente' ? C.amber : C.teal,
                        fontFamily: 'Space Grotesk', flexShrink: 0
                      }}>
                        {c.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: C.muted }}>{c.contato}</td>
                  <td style={{ padding: '12px 12px', fontSize: 13, color: C.muted }}>{c.ultimaCompra}</td>
                  <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.text }}>R$ {c.totalGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '12px 12px', fontFamily: 'IBM Plex Mono', fontSize: 13, color: C.muted }}>{c.pedidos}</td>
                  <td style={{ padding: '12px 12px' }}><Badge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}

// RELATORIOS
function RelatoriosScreen() {
  const [cat, setCat] = useState('Vendas')
  const isMobile = useIsMobile()
  const pad = isMobile ? '16px' : '28px 32px'

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg, paddingBottom: isMobile ? 64 : 0 }}>
      <Header title="Relatórios" subtitle="Análise completa do seu negócio" actions={
        !isMobile ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" size="sm"><Download size={13} /> PDF</Btn>
            <Btn variant="ghost" size="sm"><Download size={13} /> Excel</Btn>
          </div>
        ) : undefined
      } />
      <div style={{ padding: pad, display: 'flex', flexDirection: 'column', gap: isMobile ? 12 : 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Vendas', 'Estoque', 'Financeiro', 'Clientes'].map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              background: cat === c ? C.amber : C.panel,
              color: cat === c ? '${C.bg}' : C.muted,
              border: `1px solid ${cat === c ? C.amber : C.border}`,
              borderRadius: 8, padding: '8px 18px', fontSize: 13,
              fontWeight: cat === c ? 600 : 400, cursor: 'pointer', fontFamily: 'Inter'
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: isMobile ? 10 : 16 }}>
          {cat === 'Vendas' && <>
            <MetricCard icon={ShoppingCart} label="Total vendido" value="R$ 84.200" sub="últimos 30 dias" trend={14.2} color={C.amber} sparkData={[60000, 65000, 70000, 72000, 76000, 80000, 84200]} />
            <MetricCard icon={TrendingUp} label="Ticket médio" value="R$ 74,73" sub="últimos 30 dias" trend={3.1} color={C.teal} sparkData={[68, 70, 71, 72, 73, 74, 74.73]} />
            <MetricCard icon={Package} label="Pedidos" value="1.126" sub="últimos 30 dias" trend={8.3} color={C.amber} sparkData={[900, 950, 980, 1000, 1050, 1100, 1126]} />
          </>}
          {cat === 'Financeiro' && <>
            <MetricCard icon={ArrowUpRight} label="Receita total" value="R$ 84.200" sub="últimos 30 dias" trend={14.2} color={C.teal} sparkData={[60000, 65000, 70000, 72000, 76000, 80000, 84200]} />
            <MetricCard icon={ArrowDownRight} label="Despesas" value="R$ 52.400" sub="últimos 30 dias" trend={-2.1} color={C.red} sparkData={[48000, 49000, 50000, 51000, 52000, 52400, 52400]} />
            <MetricCard icon={DollarSign} label="Margem de lucro" value="37,8%" sub="últimos 30 dias" trend={6.2} color={C.amber} sparkData={[32, 33, 34, 35, 36, 37, 37.8]} />
          </>}
          {cat === 'Estoque' && <>
            <MetricCard icon={Package} label="Produtos" value="124" sub="cadastrados" color={C.teal} sparkData={[110, 112, 115, 118, 120, 122, 124]} />
            <MetricCard icon={AlertTriangle} label="Alertas" value="7" sub="precisam de atenção" color={C.amber} sparkData={[2, 4, 3, 5, 6, 7, 7]} />
            <MetricCard icon={RotateCcw} label="Giro de estoque" value="12x" sub="por mês" color={C.teal} sparkData={[8, 9, 10, 10, 11, 12, 12]} />
          </>}
          {cat === 'Clientes' && <>
            <MetricCard icon={Users} label="Total" value="284" sub="clientes" trend={8.2} color={C.teal} sparkData={[240, 248, 255, 260, 268, 276, 284]} />
            <MetricCard icon={Star} label="Retenção" value="78,4%" sub="retorno em 30 dias" trend={4.1} color={C.amber} sparkData={[70, 72, 73, 74, 76, 77, 78.4]} />
            <MetricCard icon={TrendingUp} label="NPS" value="72" sub="satisfação" trend={5.8} color={C.teal} sparkData={[60, 63, 65, 67, 69, 71, 72]} />
          </>}
        </div>

        <Card style={{ padding: '22px 24px' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 600, margin: '0 0 20px', color: C.text }}>
            {cat} — últimos 6 meses
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={financeData}>
              <defs>
                <linearGradient id="report-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.amber} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={60}
                tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="entradas" name="Total" stroke={C.amber} fill="url(#report-grad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}

// ATENDIMENTO
function AtendimentoScreen() {
  const [activeConv, setActiveConv] = useState(0)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState<'conversas' | 'pedidos' | 'agendamentos'>('conversas')

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <Header title="Atendimento" subtitle="Gerencie suas conversas e pedidos do WhatsApp" actions={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            background: 'rgba(53,211,154,0.1)', border: '1px solid rgba(53,211,154,0.3)', borderRadius: 8
          }}>
            <Phone size={14} color={C.teal} />
            <span style={{ fontSize: 13, color: C.teal, fontWeight: 500 }}>
              Pedidos WhatsApp hoje: <strong style={{ fontFamily: 'IBM Plex Mono' }}>14</strong>
            </span>
          </div>
          <Btn variant="primary"><Smartphone size={14} /> Conectar WhatsApp</Btn>
        </div>
      } />

      <div style={{ display: 'flex', gap: 8, padding: '12px 32px 0', borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        {(['conversas', 'pedidos', 'agendamentos'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            borderBottom: `2px solid ${tab === t ? C.amber : 'transparent'}`,
            padding: '8px 16px', cursor: 'pointer', fontSize: 13,
            color: tab === t ? C.amber : C.muted, fontFamily: 'Inter', fontWeight: tab === t ? 500 : 400,
            textTransform: 'capitalize'
          }}>{t}</button>
        ))}
      </div>

      {tab === 'conversas' && (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '300px 1fr', overflow: 'hidden' }}>
          {/* Conversation list */}
          <div style={{ borderRight: `1px solid ${C.border}`, overflowY: 'auto', background: C.panel }}>
            {conversations.map((c, i) => (
              <div key={i} onClick={() => setActiveConv(i)} style={{
                padding: '14px 16px', cursor: 'pointer',
                background: activeConv === i ? C.raised : 'none',
                borderBottom: `1px solid ${C.border}`,
                display: 'flex', gap: 10, alignItems: 'flex-start'
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `rgba(47,155,255,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: C.amber, fontFamily: 'Space Grotesk'
                  }}>
                    {c.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  {c.online && (
                    <span style={{
                      position: 'absolute', bottom: 1, right: 1, width: 9, height: 9,
                      borderRadius: '50%', background: C.teal, border: `2px solid ${C.panel}`
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{c.nome}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{c.hora}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.msg}
                  </p>
                </div>
                {c.unread > 0 && (
                  <span style={{
                    background: C.amber, color: '#071A2F', borderRadius: '50%',
                    width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0
                  }}>{c.unread}</span>
                )}
              </div>
            ))}
          </div>

          {/* Chat */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${C.border}`, background: C.panel, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(47,155,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.amber, fontFamily: 'Space Grotesk' }}>
                {conversations[activeConv].nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: C.text, margin: 0 }}>{conversations[activeConv].nome}</p>
                <p style={{ fontSize: 11, color: conversations[activeConv].online ? C.teal : C.muted, margin: 0 }}>
                  {conversations[activeConv].online ? 'Online agora' : 'Offline'}
                </p>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '70%', padding: '10px 14px', borderRadius: 12,
                    background: m.from === 'me' ? C.amber : m.from === 'system' ? 'rgba(53,211,154,0.1)' : C.raised,
                    color: m.from === 'me' ? '${C.bg}' : m.from === 'system' ? C.teal : C.text,
                    border: m.from === 'system' ? `1px solid rgba(53,211,154,0.25)` : 'none',
                    fontSize: 13, whiteSpace: 'pre-line'
                  }}>
                    {m.from === 'system' && <p style={{ fontSize: 10, color: C.teal, margin: '0 0 4px', fontWeight: 600 }}>🤖 CONTROLAI AUTO-DETECT</p>}
                    {m.text}
                    <p style={{ fontSize: 10, color: m.from === 'me' ? 'rgba(10,17,32,0.6)' : C.muted, margin: '4px 0 0', textAlign: 'right' }}>{m.hora}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
              <input
                placeholder="Digite uma mensagem..."
                value={msg}
                onChange={e => setMsg(e.target.value)}
                style={{
                  flex: 1, background: C.raised, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: '9px 14px', color: C.text, fontSize: 13, outline: 'none', fontFamily: 'Inter'
                }}
              />
              <button style={{
                width: 38, height: 38, borderRadius: 8, background: C.amber, border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Send size={16} color="#071A2F" />
              </button>
            </div>
          </div>
        </div>
      )}

      {tab !== 'conversas' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: C.muted }}>
          <FileText size={40} strokeWidth={1} />
          <p style={{ fontSize: 14 }}>Seção de {tab} em breve</p>
        </div>
      )}
    </div>
  )
}

// CONFIGURACOES
function ConfiguracoesScreen() {
  const [nome, setNome] = useState('João Costa')
  const [negocio, setNegocio] = useState('Lanchonete do João')
  const [email, setEmail] = useState('joao@lanchonete.com.br')
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: C.bg }}>
      <Header title="Configurações" subtitle="Gerencie sua conta e preferências" />
      <div style={{ padding: '28px 32px', maxWidth: 680 }}>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'rgba(53,211,154,0.1)', border: '1px solid rgba(53,211,154,0.3)', borderRadius: 10, marginBottom: 20 }}>
            <CheckCircle size={16} color={C.teal} />
            <span style={{ fontSize: 13, color: C.teal }}>Configurações salvas com sucesso!</span>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            {
              title: 'Perfil', fields: [
                { label: 'Nome completo', value: nome, set: setNome },
                { label: 'Nome do negócio', value: negocio, set: setNegocio },
                { label: 'E-mail', value: email, set: setEmail },
              ]
            },
            {
              title: 'Plano e faturamento', fields: []
            }
          ].map(section => (
            <Card key={section.title} style={{ padding: '24px 26px' }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, margin: '0 0 18px', color: C.text }}>
                {section.title}
              </h3>
              {section.title === 'Plano e faturamento' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(47,155,255,0.08)', border: '1px solid rgba(47,155,255,0.2)', borderRadius: 10 }}>
                  <div>
                    <p style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, color: C.amber, margin: 0 }}>Plano Pro ⚡</p>
                    <p style={{ fontSize: 13, color: C.muted, margin: '3px 0 0' }}>R$ 89,90/mês · Renova em 15/09/2026</p>
                  </div>
                  <Btn variant="outline">Gerenciar plano</Btn>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {section.fields.map(f => (
                    <div key={f.label}>
                      <label style={{ fontSize: 13, color: C.muted, display: 'block', marginBottom: 6 }}>{f.label}</label>
                      <Input value={f.value} onChange={f.set} />
                    </div>
                  ))}
                  <div style={{ paddingTop: 6 }}>
                    <Btn variant="primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }}>
                      <CheckCircle size={14} /> Salvar alterações
                    </Btn>
                  </div>
                </div>
              )}
            </Card>
          ))}

          <Card style={{ padding: '24px 26px' }}>
            <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 600, margin: '0 0 14px', color: C.text }}>
              Integrações
            </h3>
            {[
              { label: 'WhatsApp Business', desc: 'Receba pedidos automaticamente', status: 'Conectado', color: C.teal },
              { label: 'Mercado Pago', desc: 'Receba via Pix e cartão', status: 'Conectar', color: C.muted },
              { label: 'iFood', desc: 'Sincronize pedidos iFood', status: 'Conectar', color: C.muted },
            ].map(int => (
              <div key={int.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.text, margin: 0 }}>{int.label}</p>
                  <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{int.desc}</p>
                </div>
                <span style={{ fontSize: 13, color: int.color, fontWeight: 500, cursor: 'pointer' }}>{int.status}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── IA ASSISTENTE ───────────────────────────────────────────────────────────
type IAMsg = { from: 'user' | 'ai'; text: string; hora: string }

const iaSuggestions = [
  { icon: TrendingUp, text: 'Como aumentar minhas vendas este mês?' },
  { icon: AlertTriangle, text: 'Quais produtos estão com estoque crítico?' },
  { icon: DollarSign, text: 'Como melhorar meu fluxo de caixa?' },
  { icon: Users, text: 'Dicas para fidelizar clientes recorrentes' },
]

const iaResponses: Record<string, string> = {
  vendas: `📈 **Estratégias para aumentar suas vendas:**\n\n• **Combo de produtos**: Una hambúrguer + bebida com 10% de desconto — seu ticket médio subirá de R$ 74 para ~R$ 85.\n• **Horário de pico**: Suas vendas sobem 38% às sextas. Garanta estoque cheio na quinta.\n• **Reativação**: 3 clientes não compram há mais de 7 dias — envie um cupom de R$ 10 via WhatsApp.\n• **Cardápio digital**: Clientes que veem foto compram 24% mais. Adicione imagens aos produtos.`,
  estoque: `📦 **Alertas de estoque — ação imediata:**\n\n🔴 **Crítico (zerar em < 2 dias):**\n• Batata frita 2kg — apenas 2 un. (mínimo: 10)\n• Suco de laranja 1L — apenas 3 un. (mínimo: 12)\n\n🟡 **Baixo (repor esta semana):**\n• Coca-Cola 350ml — 4 un. de 20 no mínimo\n• Hambúrguer artesanal — 7 de 15 no mínimo\n\n💡 **Dica**: Configure alertas automáticos para ser notificado 3 dias antes de atingir o mínimo.`,
  caixa: `💰 **Como melhorar seu fluxo de caixa:**\n\n• **Receba mais via Pix**: Pix tem custo zero e liquidação imediata. Ofereça 2% de desconto para pagamentos em Pix.\n• **Negocie prazos**: Tente pagar fornecedores em 30 dias e receber vendas à vista — isso libera ~R$ 4.200 em capital.\n• **Corte saídas desnecessárias**: Identifiquei que suas saídas cresceram 4,3% este mês. Revise contratos fixos.\n• **Reserva de emergência**: Mantenha 2 meses de despesas fixas guardados (≈ R$ 3.600).`,
  clientes: `🤝 **Fidelização de clientes — estratégias comprovadas:**\n\n• **Programa de pontos simples**: A cada R$ 100 gastos, o cliente ganha R$ 10. Juliana (R$ 6.780 gastos) adoraria.\n• **Aniversário deles**: Envie um desconto no mês de aniversário — custo baixo, impacto alto.\n• **WhatsApp direto**: Clientes que recebem mensagem personalizada voltam 2x mais rápido.\n• **Pedro Oliveira** é seu cliente mais valioso (31 pedidos). Dê a ele um status VIP com frete grátis.`,
}

function getIAResponse(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('venda') || t.includes('fatura') || t.includes('aumentar')) return iaResponses.vendas
  if (t.includes('estoque') || t.includes('produto') || t.includes('crítico')) return iaResponses.estoque
  if (t.includes('caixa') || t.includes('dinheiro') || t.includes('fluxo') || t.includes('finan')) return iaResponses.caixa
  if (t.includes('cliente') || t.includes('fideliz') || t.includes('recorrent')) return iaResponses.clientes
  return `🤖 Entendido! Analisei os dados do seu negócio e vou te ajudar.\n\nCom base no seu histórico:\n• Vendas esta semana: **R$ 17.400** (+12,5%)\n• Produtos críticos: **4 itens** precisam de reposição\n• Clientes inativos: **3** não compram há 7+ dias\n\nMe diga mais especificamente o que quer melhorar: vendas, estoque, financeiro ou clientes? Vou dar uma análise detalhada com ações práticas.`
}

function IAAssistenteScreen() {
  const isMobile = useIsMobile()
  const [messages, setMessages] = useState<IAMsg[]>([
    {
      from: 'ai',
      hora: 'agora',
      text: `Olá, João! 👋 Sou a **IA do ControlAi**, sua assistente de negócios.\n\nAnalisei seus dados em tempo real:\n• 📈 Vendas hoje: **R$ 2.840** (+12,5%)\n• ⚠️ **4 produtos** com estoque crítico\n• 💰 Saldo atual: **R$ 8.420**\n\nComo posso te ajudar a crescer hoje?`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function sendMessage(text: string) {
    if (!text.trim()) return
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { from: 'user', text: text.trim(), hora }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'ai', text: getIAResponse(text), hora }])
      setLoading(false)
    }, 1200)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden', paddingBottom: isMobile ? 60 : 0 }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? '16px 20px' : '20px 32px', borderBottom: `1px solid ${C.border}`,
        background: C.panel, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(53,211,154,0.2), rgba(47,155,255,0.2))',
            border: '1px solid rgba(53,211,154,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Bot size={22} color={C.teal} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: 'Space Grotesk', fontSize: isMobile ? 16 : 18, fontWeight: 700, margin: 0, color: C.text }}>
                IA Assistente
              </h1>
              <span style={{
                fontSize: 10, fontWeight: 700, color: C.teal, letterSpacing: '0.06em',
                background: 'rgba(53,211,154,0.12)', border: '1px solid rgba(53,211,154,0.3)',
                borderRadius: 4, padding: '2px 6px'
              }}>CONTROLAI</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: C.teal, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal, display: 'inline-block' }} />
              Online — Analisando seus dados em tempo real
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            padding: '6px 14px', background: 'rgba(47,155,255,0.08)',
            border: `1px solid ${C.border}`, borderRadius: 8,
            fontSize: 12, color: C.muted, display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 6
          }}>
            <Sparkles size={13} color={C.amber} />
            Powered by ControlAi Intelligence
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Suggestions — only if 1 message */}
        {messages.length === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 10, marginBottom: 8 }}>
            {iaSuggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.text)} style={{
                background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: '14px 14px', cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 8,
                transition: 'border-color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderMed)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <s.icon size={16} color={C.amber} />
                <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>{s.text}</span>
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start' }}>
            {m.from === 'ai' && (
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(53,211,154,0.2), rgba(47,155,255,0.2))',
                border: '1px solid rgba(53,211,154,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={16} color={C.teal} />
              </div>
            )}
            <div style={{
              maxWidth: '72%',
              background: m.from === 'user' ? C.amber : C.panel,
              border: m.from === 'ai' ? `1px solid ${C.border}` : 'none',
              borderRadius: m.from === 'user' ? '12px 12px 4px 12px' : '4px 12px 12px 12px',
              padding: '12px 16px',
              color: m.from === 'user' ? '#071A2F' : C.text,
              fontSize: 13, lineHeight: 1.65,
              whiteSpace: 'pre-line',
            }}>
              {m.text.replace(/\*\*(.*?)\*\*/g, '$1')}
              <p style={{ fontSize: 10, color: m.from === 'user' ? 'rgba(7,26,47,0.5)' : C.muted, margin: '6px 0 0', textAlign: 'right' }}>
                {m.hora}
              </p>
            </div>
            {m.from === 'user' && (
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.highlight}, ${C.teal})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 13, color: '#071A2F'
              }}>JC</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(53,211,154,0.2), rgba(47,155,255,0.2))',
              border: '1px solid rgba(53,211,154,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bot size={16} color={C.teal} />
            </div>
            <div style={{
              background: C.panel, border: `1px solid ${C.border}`,
              borderRadius: '4px 12px 12px 12px', padding: '14px 18px',
              display: 'flex', gap: 6, alignItems: 'center'
            }}>
              {[0, 1, 2].map(j => (
                <span key={j} style={{
                  width: 7, height: 7, borderRadius: '50%', background: C.teal,
                  display: 'inline-block',
                  animation: `ia-pulse 1.2s ease-in-out ${j * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: isMobile ? '12px 16px' : '16px 32px', borderTop: `1px solid ${C.border}`,
        background: C.panel,
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Lightbulb size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
            <input
              placeholder="Pergunte sobre vendas, estoque, finanças ou clientes..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
              disabled={loading}
              style={{
                width: '100%', background: C.raised, border: `1px solid ${C.borderMed}`,
                borderRadius: 10, padding: '11px 14px 11px 36px', color: C.text,
                fontSize: 13, outline: 'none', fontFamily: 'Inter',
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42, borderRadius: 10, flexShrink: 0,
              background: input.trim() && !loading ? C.teal : C.raised,
              border: `1px solid ${input.trim() && !loading ? C.teal : C.border}`,
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
          >
            <Send size={16} color={input.trim() && !loading ? '#071A2F' : C.muted} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: C.muted, margin: '8px 0 0', textAlign: 'center' }}>
          IA treinada com os dados do seu negócio · Respostas geradas automaticamente
        </p>
      </div>

      <style>{`
        @keyframes ia-pulse {
          0%, 60%, 100% { transform: scale(1); opacity: 0.4; }
          30% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useIsMobile()

  if (screen === 'landing') {
    return <LandingPage onEnter={() => setScreen('login')} />
  }

  if (screen === 'login') {
    return <LoginScreen onLogin={() => setScreen('dashboard')} />
  }

  const screenMap: Record<string, React.ReactNode> = {
    dashboard: <DashboardScreen setScreen={setScreen} />,
    vendas: <VendasScreen setScreen={setScreen} />,
    'nova-venda': <NovaVendaScreen setScreen={setScreen} />,
    estoque: <EstoqueScreen setScreen={setScreen} />,
    'add-produto': <AddProdutoScreen setScreen={setScreen} />,
    financeiro: <FinanceiroScreen />,
    clientes: <ClientesScreen />,
    relatorios: <RelatoriosScreen />,
    atendimento: <AtendimentoScreen />,
    'ia-assistente': <IAAssistenteScreen />,
    configuracoes: <ConfiguracoesScreen />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.bg }}>
      {/* Sidebar — desktop only */}
      {!isMobile && (
        <div style={{ display: 'flex', flexShrink: 0 }}>
          <Sidebar screen={screen} setScreen={setScreen} collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {screenMap[screen] ?? screenMap['dashboard']}
      </main>

      {/* Bottom nav — mobile only */}
      {isMobile && <BottomNav screen={screen} setScreen={setScreen} />}
    </div>
  )
}
