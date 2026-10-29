import { ArrowRight, BarChart3, Package, ShoppingCart, Sparkles, Users, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const features = [
  { icon: Package, title: 'Estoque', text: 'Produtos, quantidades e alertas de reposição antes de faltar.' },
  { icon: ShoppingCart, title: 'Vendas', text: 'Registre pedidos com Pix, dinheiro ou cartão. O estoque baixa sozinho.' },
  { icon: Wallet, title: 'Financeiro', text: 'Entradas, saídas e saldo do mês em um só lugar.' },
  { icon: Users, title: 'Clientes', text: 'Saiba quem compra mais e quem sumiu há semanas.' },
  { icon: BarChart3, title: 'Relatórios', text: 'Vendas por categoria, produtos campeões e formas de pagamento.' },
  { icon: Sparkles, title: 'Assistente', text: 'Recomendações automáticas a partir dos dados reais do negócio.' },
]

const problems = [
  ['Informações espalhadas', 'Vendas, pedidos e estoque ficam em cadernos, planilhas e conversas.'],
  ['Pouca visibilidade', 'É difícil saber quanto entrou, quanto saiu e o que precisa ser reposto.'],
  ['Trabalho manual', 'Contas feitas à mão tomam tempo e aumentam o risco de erro.'],
]

const audience = ['Lojas', 'Salões de beleza', 'Lanchonetes', 'Oficinas', 'Microempreendedores']

export default function Landing() {
  return (
    <div>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Link to="/entrar" className="rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:text-ink">
            Entrar
          </Link>
          <Link to="/cadastro" className="rounded-xl bg-brand-dark px-4 py-2 text-sm font-semibold hover:bg-brand">
            Criar conta
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:pt-24">
        <p className="mb-4 inline-block rounded-full border border-line px-3 py-1 text-xs font-medium text-brand">Gestão para pequenos negócios</p>
        <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.05] sm:text-7xl">
          Do caos ao <span className="text-brand">controle.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          O Controlai reúne estoque, vendas e finanças em um único painel. Chega de depender de cadernos, planilhas e mensagens espalhadas.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/cadastro" className="inline-flex items-center gap-2 rounded-xl bg-brand-dark px-6 py-3 font-semibold hover:bg-brand">
            Começar agora <ArrowRight size={18} />
          </Link>
          <Link to="/entrar" className="rounded-xl border border-line px-6 py-3 font-semibold hover:bg-raised">
            Ver a demonstração
          </Link>
        </div>
      </section>

      <section className="border-y border-line/50 bg-panel/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl font-bold">O problema</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {problems.map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-line/60 bg-panel p-6">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-3xl font-bold">Tudo em um só lugar</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-line/60 bg-panel p-6">
              <span className="mb-4 grid size-10 place-items-center rounded-xl bg-brand/15 text-brand">
                <Icon size={20} />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line/50 bg-panel/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl font-bold">Para quem é</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {audience.map((a) => (
              <span key={a} className="rounded-full border border-line px-5 py-2 text-sm font-medium">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-muted">
        <Logo />
        <span>Projeto acadêmico · Senac · Técnico em Informática para Internet</span>
      </footer>
    </div>
  )
}
