import { BarChart3, DollarSign, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingCart, Sparkles, Users, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const nav = [
  { to: '/painel', label: 'Visão geral', icon: LayoutDashboard },
  { to: '/vendas', label: 'Vendas', icon: ShoppingCart },
  { to: '/estoque', label: 'Estoque', icon: Package },
  { to: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/assistente', label: 'Assistente', icon: Sparkles },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpen(false) // fecha o menu no celular ao navegar
  }

  return (
    <div className="min-h-screen lg:pl-64">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line/60 bg-bg/95 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'} className="rounded-lg p-2 hover:bg-raised">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-line/60 bg-panel px-3 pb-4 pt-5 transition-transform max-lg:top-[57px] lg:translate-x-0 ${open ? 'translate-x-0' : 'max-lg:-translate-x-full'}`}
      >
        <div className="mb-6 hidden px-3 lg:block">
          <Logo />
        </div>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Menu principal">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-brand/15 text-brand' : 'text-muted hover:bg-raised hover:text-ink'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line/60 px-3 pt-4">
          <p className="truncate text-sm font-semibold">{user?.businessName}</p>
          <p className="truncate text-xs text-muted">{user?.name}</p>
          <button onClick={logout} className="mt-3 flex items-center gap-2 text-sm text-muted hover:text-ink">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
