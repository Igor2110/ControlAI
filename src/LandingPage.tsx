import { useState, useEffect } from 'react'
import { useIsMobile } from './useIsMobile'
import {
  Zap, BarChart2, Package, DollarSign, Users, ChevronRight,
  ArrowRight, TrendingUp, ArrowUpRight, AlertTriangle, CheckCircle,
  BookOpen, Scissors, ShoppingBag, Wrench, Menu, X, Layers,
  Target, Lightbulb, Rocket, Brain, Star
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const B = {
  bg: '#071A2F',
  bg2: '#0A223D',
  card: '#0E2D4D',
  raised: '#123A60',
  blue: '#1677D2',
  highlight: '#2F9BFF',
  light: '#67B7FF',
  soft: '#DCEEFF',
  white: '#F8FAFC',
  muted: '#8FA8BF',
  green: '#35D39A',
  red: '#F06A6A',
  border: 'rgba(47,155,255,0.12)',
  borderMed: 'rgba(47,155,255,0.2)',
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
function GlowDot({ x, y, size = 300, opacity = 0.12 }: { x: string; y: string; size?: number; opacity?: number }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      borderRadius: '50%', background: B.highlight, opacity,
      filter: `blur(${size * 0.4}px)`, pointerEvents: 'none', transform: 'translate(-50%,-50%)',
    }} />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '5px 14px', borderRadius: 100,
      background: 'rgba(47,155,255,0.1)', border: `1px solid ${B.borderMed}`,
      marginBottom: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: B.highlight, display: 'block' }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: B.light, letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif' }}>
        {children}
      </span>
    </div>
  )
}

function BigNumber({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 48, fontWeight: 700, color: B.highlight, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 600, color: B.white, marginTop: 8 }}>{label}</div>
      {sub && <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ─── MINI DASHBOARD MOCKUP ───────────────────────────────────────────────────
const mockChartData = [
  { d: 'Seg', v: 1820 }, { d: 'Ter', v: 2340 }, { d: 'Qua', v: 1960 },
  { d: 'Qui', v: 2780 }, { d: 'Sex', v: 3120 }, { d: 'Sáb', v: 2540 }, { d: 'Dom', v: 2840 },
]

function MiniSparkline({ color }: { color: string }) {
  const data = [40, 60, 45, 75, 65, 90, 80]
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const W = 60, H = 24, p = 2
  const pts = data.map((v, i) => {
    const x = p + (i / (data.length - 1)) * (W - p * 2)
    const y = H - p - ((v - min) / range) * (H - p * 2)
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={W} height={H} fill="none">
      <polyline points={pts} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DashboardMockup() {
  const navItems = [
    { icon: BarChart2, label: 'Visão geral', active: true },
    { icon: ShoppingBag, label: 'Vendas' },
    { icon: Package, label: 'Estoque' },
    { icon: DollarSign, label: 'Financeiro' },
    { icon: Users, label: 'Clientes' },
  ]
  const metrics = [
    { label: 'Vendas hoje', value: 'R$ 2.840', change: '+12,5%', up: true, color: B.highlight },
    { label: 'Pedidos', value: '38', change: '+8 hoje', up: true, color: B.green },
    { label: 'Estoque', value: '124', change: '7 alertas', up: false, color: '#F59E0B' },
    { label: 'Saldo', value: 'R$ 8.420', change: '+6,2%', up: true, color: B.green },
  ]
  const alerts = [
    { nome: 'Coca-Cola 350ml', qty: 4 },
    { nome: 'Batata frita 2kg', qty: 2 },
    { nome: 'Hambúrguer', qty: 7 },
  ]

  return (
    <div style={{
      width: '100%', maxWidth: 620,
      background: B.bg2, borderRadius: 16, border: `1px solid ${B.borderMed}`,
      overflow: 'hidden', boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px ${B.border}`,
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Window chrome */}
      <div style={{ background: B.card, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${B.border}` }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F06A6A' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#35D39A' }} />
        <div style={{ flex: 1, marginLeft: 8, background: B.raised, borderRadius: 4, height: 18, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
          <span style={{ fontSize: 9, color: B.muted }}>app.controlai.com.br</span>
        </div>
      </div>

      <div style={{ display: 'flex', height: 380 }}>
        {/* Sidebar */}
        <div style={{ width: 130, background: B.card, borderRight: `1px solid ${B.border}`, padding: '14px 0', flexShrink: 0 }}>
          <div style={{ padding: '0 12px 14px', borderBottom: `1px solid ${B.border}`, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: B.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={10} color="#fff" />
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 700, color: B.white }}>Controlai</span>
            </div>
          </div>
          {navItems.map(({ icon: Icon, label, active }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px',
              background: active ? 'rgba(47,155,255,0.12)' : 'none',
              borderLeft: active ? `2px solid ${B.highlight}` : '2px solid transparent',
              color: active ? B.highlight : B.muted,
            }}>
              <Icon size={12} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: '14px 14px', overflowY: 'auto', background: B.bg2 }}>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, fontWeight: 700, color: B.white, margin: '0 0 12px' }}>
            Bom dia, João 👋
          </p>
          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {metrics.map(m => (
              <div key={m.label} style={{ background: B.card, borderRadius: 8, padding: '8px 10px', border: `1px solid ${B.border}` }}>
                <p style={{ fontSize: 9, color: B.muted, margin: '0 0 4px' }}>{m.label}</p>
                <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 700, color: B.white, margin: '0 0 4px' }}>{m.value}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, color: m.up ? B.green : '#F59E0B', fontFamily: 'IBM Plex Mono' }}>{m.change}</span>
                  <MiniSparkline color={m.color} />
                </div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div style={{ background: B.card, borderRadius: 8, padding: '10px', border: `1px solid ${B.border}`, marginBottom: 10 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: B.white, margin: '0 0 8px', fontFamily: 'Space Grotesk' }}>Desempenho das vendas</p>
            <ResponsiveContainer width="100%" height={70}>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="mock-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={B.highlight} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={B.highlight} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="d" tick={{ fontSize: 7, fill: B.muted }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="v" stroke={B.highlight} fill="url(#mock-grad)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Alerts */}
          <div style={{ background: B.card, borderRadius: 8, padding: '10px', border: `1px solid rgba(240,106,106,0.2)` }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: B.white, margin: '0 0 6px', fontFamily: 'Space Grotesk' }}>Estoque em atenção</p>
            {alerts.map(a => (
              <div key={a.nome} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${B.border}` }}>
                <span style={{ fontSize: 9, color: B.muted }}>{a.nome}</span>
                <span style={{ fontSize: 9, color: B.red, fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>{a.qty} un.</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── FLOATING CARDS ───────────────────────────────────────────────────────────
function FloatingCard({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div style={{
      position: 'absolute',
      background: B.raised, border: `1px solid ${B.borderMed}`,
      borderRadius: 12, padding: '10px 14px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      zIndex: 10, fontFamily: 'Inter, sans-serif',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ onCTA }: { onCTA: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { label: 'O projeto', id: 'o-projeto' },
    { label: 'Problema', id: 'problema' },
    { label: 'Solução', id: 'solucao' },
    { label: 'Funcionalidades', id: 'funcionalidades' },
    { label: 'Para quem é', id: 'para-quem' },
  ]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: isMobile ? '0 20px' : '0 40px',
        background: scrolled || menuOpen ? `rgba(7,26,47,0.97)` : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${B.border}` : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: B.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={17} color="#fff" />
            </div>
            <div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: B.white }}>Controlai</span>
              {!isMobile && <span style={{ display: 'block', fontSize: 9, color: B.muted, lineHeight: 1, marginTop: 1, fontFamily: 'Inter' }}>Gestão sem complicação</span>}
            </div>
          </div>

          {/* Desktop menu */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {navLinks.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: B.muted, fontFamily: 'Inter', padding: 0,
                }}>{item.label}</button>
              ))}
            </div>
          )}

          {/* Desktop CTA / Mobile hamburger */}
          {isMobile ? (
            <button onClick={() => setMenuOpen(o => !o)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: B.white,
              display: 'flex', padding: 4,
            }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          ) : (
            <button onClick={onCTA} style={{
              background: B.blue, color: '#fff', border: 'none', borderRadius: 8,
              padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              Conheça a plataforma <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Mobile dropdown */}
        {isMobile && menuOpen && (
          <div style={{ padding: '12px 0 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 15, color: B.white, fontFamily: 'Inter', padding: '10px 4px',
                borderBottom: `1px solid ${B.border}`,
              }}>{item.label}</button>
            ))}
            <button onClick={() => { setMenuOpen(false); onCTA() }} style={{
              marginTop: 12, background: B.blue, color: '#fff', border: 'none', borderRadius: 8,
              padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
            }}>
              Conheça a plataforma
            </button>
          </div>
        )}
      </nav>
    </>
  )
}

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

function HeroSection({ onCTA }: { onCTA: () => void }) {
  const isMobile = useIsMobile()
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: isMobile ? '100px 20px 60px' : '100px 40px 80px',
      position: 'relative', overflow: 'hidden',
      background: `linear-gradient(160deg, #071A2F 0%, #0A223D 60%, #071A2F 100%)`,
    }}>
      <GlowDot x="10%" y="30%" size={500} opacity={0.06} />
      <GlowDot x="80%" y="60%" size={400} opacity={0.07} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.1fr',
        gap: isMobile ? 48 : 64, alignItems: 'center',
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
            borderRadius: 100, background: 'rgba(47,155,255,0.1)', border: `1px solid ${B.borderMed}`,
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: B.green, display: 'block' }} />
            <span style={{ fontSize: isMobile ? 9 : 11, color: B.light, fontWeight: 600, letterSpacing: '0.06em', fontFamily: 'Inter' }}>
              PLATAFORMA DE GESTÃO PARA PEQUENOS NEGÓCIOS
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: isMobile ? 40 : 62,
            fontWeight: 700, lineHeight: 1.05, margin: '0 0 20px', color: B.white,
          }}>
            Do caos ao{' '}
            <span style={{ color: B.highlight, textShadow: `0 0 40px rgba(47,155,255,0.5)` }}>
              controle.
            </span>
          </h1>

          <p style={{ fontSize: isMobile ? 15 : 17, color: B.muted, lineHeight: 1.65, margin: '0 0 10px', fontFamily: 'Inter' }}>
            O Controlai reúne estoque, vendas e finanças em um único lugar para ajudar pequenos negócios a trabalharem com mais organização e clareza.
          </p>
          <p style={{ fontSize: 13, color: B.muted, opacity: 0.7, margin: '0 0 32px', fontFamily: 'Inter' }}>
            Chega de depender de cadernos, planilhas e mensagens espalhadas.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={onCTA} style={{
              background: B.blue, color: '#fff', border: 'none', borderRadius: 10,
              padding: isMobile ? '12px 22px' : '13px 26px', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: `0 0 30px rgba(22,119,210,0.4)`,
            }}>
              Conhecer o projeto <ArrowRight size={16} />
            </button>
            <button onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })} style={{
              background: 'rgba(47,155,255,0.08)', color: B.light, border: `1px solid ${B.borderMed}`,
              borderRadius: 10, padding: isMobile ? '12px 22px' : '13px 26px', fontSize: 15,
              cursor: 'pointer', fontFamily: 'Inter',
            }}>
              Como funciona
            </button>
          </div>
        </div>

        {/* Right — mockup + floating cards (hidden on mobile to keep it clean) */}
        {!isMobile && (
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <DashboardMockup />
            <FloatingCard style={{ top: -20, left: -40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(53,211,154,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={14} color={B.green} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: B.muted, margin: 0 }}>Vendas</p>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, fontWeight: 700, color: B.green, margin: 0 }}>+12,5%</p>
                </div>
              </div>
            </FloatingCard>
            <FloatingCard style={{ top: 80, right: -50 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(240,106,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={13} color={B.red} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: B.muted, margin: 0 }}>Estoque</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: B.red, margin: 0 }}>7 para repor</p>
                </div>
              </div>
            </FloatingCard>
            <FloatingCard style={{ bottom: 100, left: -50 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(47,155,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={13} color={B.highlight} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: B.muted, margin: 0 }}>Saldo em caixa</p>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, fontWeight: 700, color: B.white, margin: 0 }}>R$ 8.420</p>
                </div>
              </div>
            </FloatingCard>
            <FloatingCard style={{ bottom: 40, right: -40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(47,155,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={13} color={B.highlight} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: B.muted, margin: 0 }}>Pedidos hoje</p>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, fontWeight: 700, color: B.white, margin: 0 }}>38</p>
                </div>
              </div>
            </FloatingCard>
          </div>
        )}

        {/* Mobile: compact metric pills instead of the full mockup */}
        {isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: TrendingUp, label: 'Vendas', value: '+12,5%', color: B.green },
              { icon: DollarSign, label: 'Saldo', value: 'R$ 8.420', color: B.highlight },
              { icon: CheckCircle, label: 'Pedidos hoje', value: '38', color: B.highlight },
              { icon: AlertTriangle, label: 'Estoque', value: '7 alertas', color: B.red },
            ].map(m => (
              <div key={m.label} style={{
                background: B.card, border: `1px solid ${B.border}`, borderRadius: 12,
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <m.icon size={15} color={m.color} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: B.muted, margin: 0, fontFamily: 'Inter' }}>{m.label}</p>
                  <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 700, color: m.color, margin: 0 }}>{m.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function WhatIsSection() {
  const isMobile = useIsMobile()
  const chaos = ['📓 Caderno', '📊 Planilhas', '💬 WhatsApp', '📋 Papéis avulsos']
  const control = ['📦 Estoque', '💰 Vendas', '💳 Finanças', '👥 Clientes', '📈 Relatórios']

  return (
    <section id="o-projeto" style={{
      padding: isMobile ? '64px 20px' : '100px 40px', background: B.bg,
      position: 'relative', overflow: 'hidden',
    }}>
      <GlowDot x="90%" y="50%" size={400} opacity={0.05} />
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
        <div>
          <SectionLabel>O QUE É O CONTROLAI?</SectionLabel>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, color: B.white, margin: '0 0 20px', lineHeight: 1.15 }}>
            Uma plataforma feita para organizar seu negócio
          </h2>
          <p style={{ fontSize: 16, color: B.muted, lineHeight: 1.7, margin: '0 0 14px', fontFamily: 'Inter' }}>
            O Controlai é uma plataforma de gestão desenvolvida para pequenos negócios que precisam organizar suas operações em um único lugar.
          </p>
          <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.7, opacity: 0.8, fontFamily: 'Inter' }}>
            A plataforma centraliza informações que normalmente ficam espalhadas entre cadernos, planilhas, sistemas diferentes e WhatsApp.
          </p>
        </div>

        {/* Visual: chaos → control */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          {/* Chaos */}
          <div style={{ width: '100%', background: B.card, borderRadius: 14, padding: '20px 24px', border: `1px solid rgba(240,106,106,0.2)` }}>
            <p style={{ fontSize: 11, color: B.red, fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 12px', fontFamily: 'Inter' }}>
              ANTES
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {chaos.map(c => (
                <span key={c} style={{
                  padding: '6px 12px', background: 'rgba(240,106,106,0.08)', border: '1px solid rgba(240,106,106,0.2)',
                  borderRadius: 8, fontSize: 13, color: B.muted, fontFamily: 'Inter'
                }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 2, height: 20, background: `linear-gradient(${B.border}, ${B.highlight})` }} />
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: B.blue,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, color: '#fff',
              boxShadow: `0 0 20px rgba(22,119,210,0.4)`,
            }}>✦</div>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, color: B.highlight }}>Controlai</div>
            <div style={{ width: 2, height: 20, background: `linear-gradient(${B.highlight}, ${B.border})` }} />
          </div>

          {/* Control */}
          <div style={{ width: '100%', background: B.card, borderRadius: 14, padding: '20px 24px', border: `1px solid ${B.borderMed}` }}>
            <p style={{ fontSize: 11, color: B.green, fontWeight: 600, letterSpacing: '0.08em', margin: '0 0 12px', fontFamily: 'Inter' }}>
              DEPOIS
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {control.map(c => (
                <span key={c} style={{
                  padding: '6px 12px', background: 'rgba(47,155,255,0.08)', border: `1px solid ${B.border}`,
                  borderRadius: 8, fontSize: 13, color: B.light, fontFamily: 'Inter'
                }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  const isMobile = useIsMobile()
  const problems = [
    {
      num: '01',
      title: 'Informações espalhadas',
      desc: 'Vendas, pedidos e estoque ficam em diferentes lugares, tornando a gestão fragmentada e imprecisa.',
      icon: Layers,
    },
    {
      num: '02',
      title: 'Pouca visibilidade',
      desc: 'É difícil saber rapidamente quanto entrou, quanto saiu e o que precisa ser reposto.',
      icon: Target,
    },
    {
      num: '03',
      title: 'Trabalho manual',
      desc: 'Processos manuais consomem tempo e aumentam a possibilidade de erros críticos.',
      icon: AlertTriangle,
    },
  ]

  return (
    <section id="problema" style={{ padding: isMobile ? '64px 20px' : '100px 40px', background: B.bg2, position: 'relative', overflow: 'hidden' }}>
      <GlowDot x="20%" y="80%" size={350} opacity={0.05} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <SectionLabel>O PROBLEMA</SectionLabel>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, color: B.white, margin: '0 0 16px' }}>
            O pequeno negócio não precisa<br />de mais complicação.
          </h2>
          <p style={{ fontSize: 16, color: B.muted, maxWidth: 560, margin: '0 auto', fontFamily: 'Inter', lineHeight: 1.6 }}>
            Muitos empreendedores gastam tempo tentando organizar informações que deveriam estar disponíveis em poucos cliques.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          {problems.map(p => (
            <div key={p.num} style={{
              background: B.card, borderRadius: 16, padding: '32px 28px',
              border: `1px solid ${B.border}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -10, right: -10,
                fontFamily: 'IBM Plex Mono', fontSize: 80, fontWeight: 700,
                color: 'rgba(47,155,255,0.05)', lineHeight: 1,
              }}>{p.num}</div>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: 'rgba(240,106,106,0.1)',
                border: '1px solid rgba(240,106,106,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
              }}>
                <p.icon size={20} color={B.red} />
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: B.highlight, fontWeight: 600 }}>{p.num}</span>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: B.white, margin: '8px 0 12px' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.65, margin: 0, fontFamily: 'Inter' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SolutionSection() {
  const isMobile = useIsMobile()
  const modules = [
    {
      icon: Package, title: 'Estoque', color: B.highlight,
      desc: 'Produtos, quantidades e alertas de reposição em tempo real.',
      preview: [
        { label: 'Coca-Cola 350ml', value: '4 un.', status: 'baixo' },
        { label: 'Água mineral', value: '48 un.', status: 'ok' },
        { label: 'Batata frita', value: '2 un.', status: 'critico' },
      ]
    },
    {
      icon: BarChart2, title: 'Vendas', color: B.green,
      desc: 'Pedidos, faturamento e histórico de vendas organizados.',
      preview: [
        { label: 'Hoje', value: 'R$ 2.840', status: 'ok' },
        { label: 'Semana', value: 'R$ 17.400', status: 'ok' },
        { label: 'Mês', value: 'R$ 84.200', status: 'ok' },
      ]
    },
    {
      icon: DollarSign, title: 'Financeiro', color: '#F59E0B',
      desc: 'Entradas, saídas e fluxo de caixa em um só painel.',
      preview: [
        { label: 'Entradas', value: 'R$ 21.200', status: 'ok' },
        { label: 'Saídas', value: 'R$ 12.800', status: 'baixo' },
        { label: 'Lucro', value: 'R$ 8.400', status: 'ok' },
      ]
    },
  ]

  return (
    <section id="solucao" style={{ padding: isMobile ? '64px 20px' : '100px 40px', background: B.bg, position: 'relative', overflow: 'hidden' }}>
      <GlowDot x="70%" y="20%" size={400} opacity={0.05} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <SectionLabel>A SOLUÇÃO</SectionLabel>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, color: B.white, margin: '0 0 16px' }}>
            Tudo conectado em um só lugar.
          </h2>
          <p style={{ fontSize: 16, color: B.muted, maxWidth: 500, margin: '0 auto', fontFamily: 'Inter', lineHeight: 1.6 }}>
            O Controlai transforma informações dispersas em uma visão centralizada do negócio.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          {modules.map(m => (
            <div key={m.title} style={{
              background: B.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${B.border}`,
            }}>
              <div style={{ padding: '28px 28px 20px', background: `linear-gradient(135deg, ${B.raised}, ${B.card})` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${m.color}18`, border: `1px solid ${m.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <m.icon size={20} color={m.color} />
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: B.white, margin: 0 }}>{m.title}</h3>
                </div>
                <p style={{ fontSize: 14, color: B.muted, margin: 0, fontFamily: 'Inter', lineHeight: 1.6 }}>{m.desc}</p>
              </div>
              {/* Mini preview */}
              <div style={{ padding: '16px 24px 20px' }}>
                {m.preview.map(row => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '7px 0', borderBottom: `1px solid ${B.border}`,
                  }}>
                    <span style={{ fontSize: 12, color: B.muted, fontFamily: 'Inter' }}>{row.label}</span>
                    <span style={{
                      fontFamily: 'IBM Plex Mono', fontSize: 12, fontWeight: 600,
                      color: row.status === 'critico' ? B.red : row.status === 'baixo' ? '#F59E0B' : m.color
                    }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const isMobile = useIsMobile()
  const steps = [
    { num: '01', icon: BookOpen, title: 'Cadastre', desc: 'Adicione seus produtos, clientes e informações do negócio.' },
    { num: '02', icon: BarChart2, title: 'Registre', desc: 'Registre vendas e movimentações financeiras facilmente.' },
    { num: '03', icon: TrendingUp, title: 'Acompanhe', desc: 'Veja estoque, vendas e finanças em tempo real.' },
    { num: '04', icon: Target, title: 'Decida', desc: 'Use dados organizados para tomar decisões melhores.' },
  ]

  return (
    <section id="como-funciona" style={{ padding: isMobile ? '64px 20px' : '100px 40px', background: B.bg2, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>COMO FUNCIONA</SectionLabel>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, color: B.white, margin: 0 }}>
            4 passos para ter controle total
          </h2>
        </div>

        <div style={{ position: 'relative' }}>
          {!isMobile && (
            <div style={{
              position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 2,
              background: `linear-gradient(90deg, ${B.blue}, ${B.highlight}, ${B.green})`,
              opacity: 0.3,
            }} />
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 24 : 20, position: 'relative' }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${B.blue}, ${B.highlight})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, position: 'relative', zIndex: 1,
                  boxShadow: `0 0 24px rgba(22,119,210,0.4)`,
                }}>
                  <s.icon size={22} color="#fff" />
                </div>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: B.highlight, fontWeight: 600, marginBottom: 8 }}>{s.num}</span>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, color: B.white, margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, margin: 0, fontFamily: 'Inter' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardSection() {
  const isMobile = useIsMobile()
  return (
    <section id="funcionalidades" style={{ padding: isMobile ? '64px 20px' : '100px 40px', background: B.bg, position: 'relative', overflow: 'hidden' }}>
      <GlowDot x="50%" y="50%" size={600} opacity={0.04} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <SectionLabel>VISUALIZAÇÃO DO SISTEMA</SectionLabel>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, color: B.white, margin: '0 0 16px' }}>
            Tenha uma visão completa<br />do seu negócio.
          </h2>
          <p style={{ fontSize: 16, color: B.muted, fontFamily: 'Inter' }}>
            Um painel unificado com tudo que você precisa saber.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 900 }}>
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

function ForWhoSection() {
  const isMobile = useIsMobile()
  const segments = [
    {
      emoji: '🏪', title: 'Lojas', desc: 'Produtos, vendas e fornecedores.',
      items: ['Controle de estoque', 'Histórico de vendas', 'Gestão de fornecedores']
    },
    {
      emoji: '✂️', title: 'Salões', desc: 'Clientes, serviços e agendamentos.',
      items: ['Cadastro de clientes', 'Registro de serviços', 'Histórico de atendimentos']
    },
    {
      emoji: '🍔', title: 'Lanchonetes', desc: 'Pedidos, vendas e estoque.',
      items: ['Registro de pedidos', 'Controle de ingredientes', 'Relatório de vendas']
    },
    {
      emoji: '🔧', title: 'Oficinas', desc: 'Serviços, clientes e histórico.',
      items: ['OS de serviços', 'Histórico por veículo', 'Gestão financeira']
    },
  ]

  return (
    <section id="para-quem" style={{ padding: isMobile ? '64px 20px' : '100px 40px', background: B.bg2, position: 'relative' }}>
      <GlowDot x="80%" y="30%" size={350} opacity={0.05} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <SectionLabel>PARA QUEM É</SectionLabel>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: isMobile ? 30 : 40, fontWeight: 700, color: B.white, margin: 0 }}>
            Feito para pequenos negócios.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14 }}>
          {segments.map(s => (
            <div key={s.title} style={{
              background: B.card, borderRadius: 16, padding: '28px 24px',
              border: `1px solid ${B.border}`,
            }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{s.emoji}</div>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: B.white, margin: '0 0 8px' }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: B.muted, margin: '0 0 18px', fontFamily: 'Inter' }}>{s.desc}</p>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {s.items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: B.muted, fontFamily: 'Inter' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: B.highlight, flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitsSection() {
  const isMobile = useIsMobile()
  return (
    <section style={{ padding: isMobile ? '64px 20px' : '100px 40px', background: B.bg, position: 'relative', overflow: 'hidden' }}>
      <GlowDot x="50%" y="50%" size={500} opacity={0.05} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <SectionLabel>BENEFÍCIOS</SectionLabel>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, color: B.white, margin: 0 }}>
            Mais controle. Menos complicação.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: B.border, borderRadius: 20, overflow: 'hidden' }}>
          {[
            { icon: Layers, value: '3×', label: 'Mais organização', sub: 'Informações centralizadas em um só lugar', color: B.highlight },
            { icon: Rocket, value: '70%', label: 'Mais agilidade', sub: 'Menos tarefas manuais e processos repetitivos', color: B.green },
            { icon: Lightbulb, value: '100%', label: 'Mais clareza', sub: 'Uma visão real e atualizada do seu negócio', color: '#F59E0B' },
          ].map(b => (
            <div key={b.label} style={{ background: B.card, padding: '48px 40px', textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: `${b.color}15`, border: `1px solid ${b.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
              }}>
                <b.icon size={24} color={b.color} />
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 52, fontWeight: 700, color: b.color, lineHeight: 1, marginBottom: 12 }}>
                {b.value}
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, color: B.white, marginBottom: 10 }}>{b.label}</div>
              <div style={{ fontSize: 14, color: B.muted, fontFamily: 'Inter', lineHeight: 1.6 }}>{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FutureSection() {
  const isMobile = useIsMobile()
  const steps = [
    { icon: Layers, label: 'Organização', desc: 'Dados centralizados', color: B.highlight },
    { icon: Rocket, label: 'Automação', desc: 'Tarefas automáticas', color: B.light },
    { icon: Brain, label: 'Inteligência', desc: 'Insights e análises', color: B.green },
    { icon: Star, label: 'Crescimento', desc: 'Escala o negócio', color: '#F59E0B' },
  ]

  return (
    <section style={{ padding: isMobile ? '64px 20px' : '100px 40px', background: B.bg2, position: 'relative', overflow: 'hidden' }}>
      <GlowDot x="30%" y="50%" size={500} opacity={0.06} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel>VISÃO FUTURA</SectionLabel>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700, color: B.white, margin: '0 0 16px' }}>
            O futuro da gestão de<br />pequenos negócios.
          </h2>
          <p style={{ fontSize: 15, color: B.muted, maxWidth: 560, margin: '0 auto', fontFamily: 'Inter', lineHeight: 1.65 }}>
            O Controlai busca evoluir para uma plataforma cada vez mais inteligente, capaz de automatizar tarefas e ajudar empreendedores a tomar decisões melhores.
          </p>
          <div style={{ display: 'inline-block', marginTop: 16, padding: '6px 14px', background: 'rgba(47,155,255,0.08)', border: `1px solid ${B.border}`, borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: B.muted, fontFamily: 'Inter' }}>
              ⚡ Visão futura — não necessariamente disponível agora
            </span>
          </div>
        </div>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 0, alignItems: 'center', justifyItems: 'center' }}>
          {steps.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
                background: `${s.color}15`, border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <s.icon size={24} color={s.color} />
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: B.white, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: B.muted, fontFamily: 'Inter' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ onCTA }: { onCTA: () => void }) {
  const isMobile = useIsMobile()
  return (
    <section style={{
      padding: isMobile ? '80px 20px' : '120px 40px', position: 'relative', overflow: 'hidden',
      background: `linear-gradient(160deg, #071A2F 0%, #0A223D 50%, #071A2F 100%)`,
    }}>
      <GlowDot x="50%" y="50%" size={600} opacity={0.1} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'linear-gradient(rgba(47,155,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(47,155,255,0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif', fontSize: isMobile ? 34 : 52, fontWeight: 700,
          color: B.white, margin: '0 0 20px', lineHeight: 1.1,
        }}>
          Transforme o caos<br />
          <span style={{ color: B.highlight }}>em controle.</span>
        </h2>
        <p style={{ fontSize: 17, color: B.muted, margin: '0 0 48px', fontFamily: 'Inter', lineHeight: 1.6 }}>
          Tenha estoque, vendas e finanças organizados em um único lugar.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button onClick={onCTA} style={{
            background: B.blue, color: '#fff', border: 'none', borderRadius: 12,
            padding: '15px 36px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: `0 0 40px rgba(22,119,210,0.5)`,
          }}>
            Conheça o Controlai <ArrowRight size={18} />
          </button>
          <button onClick={onCTA} style={{
            background: 'rgba(47,155,255,0.08)', color: B.light,
            border: `1px solid ${B.borderMed}`, borderRadius: 12,
            padding: '15px 36px', fontSize: 16, cursor: 'pointer', fontFamily: 'Inter',
          }}>
            Ver demonstração
          </button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: B.bg, borderTop: `1px solid ${B.border}`, padding: '40px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: B.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={12} color="#fff" />
        </div>
        <span style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: B.white }}>Controlai</span>
      </div>
      <p style={{ fontSize: 13, color: B.muted, margin: 0, fontFamily: 'Inter' }}>
        Gestão sem complicação para pequenos negócios.
      </p>
    </footer>
  )
}

// ─── LANDING PAGE ROOT ────────────────────────────────────────────────────────
export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div style={{ background: B.bg, minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar onCTA={onEnter} />
      <HeroSection onCTA={onEnter} />
      <WhatIsSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <DashboardSection />
      <ForWhoSection />
      <BenefitsSection />
      <FutureSection />
      <CTASection onCTA={onEnter} />
      <Footer />
    </div>
  )
}
