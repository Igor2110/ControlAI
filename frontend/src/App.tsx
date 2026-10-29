import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import { Spinner } from './components/ui'
import Landing from './pages/Landing'
import AuthPage from './pages/AuthPage'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Sales = lazy(() => import('./pages/Sales'))
const NewSale = lazy(() => import('./pages/NewSale'))
const Products = lazy(() => import('./pages/Products'))
const Customers = lazy(() => import('./pages/Customers'))
const Finance = lazy(() => import('./pages/Finance'))
const Reports = lazy(() => import('./pages/Reports'))
const Assistant = lazy(() => import('./pages/Assistant'))
const Settings = lazy(() => import('./pages/Settings'))

function Protected() {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? <Layout /> : <Navigate to="/entrar" replace />
}

export default function App() {
  const { user } = useAuth()
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/painel" replace /> : <Landing />} />
        <Route path="/entrar" element={user ? <Navigate to="/painel" replace /> : <AuthPage mode="login" />} />
        <Route path="/cadastro" element={user ? <Navigate to="/painel" replace /> : <AuthPage mode="register" />} />
        <Route element={<Protected />}>
          <Route path="/painel" element={<Dashboard />} />
          <Route path="/vendas" element={<Sales />} />
          <Route path="/vendas/nova" element={<NewSale />} />
          <Route path="/estoque" element={<Products />} />
          <Route path="/financeiro" element={<Finance />} />
          <Route path="/clientes" element={<Customers />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/assistente" element={<Assistant />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
