Crie uma interface web moderna, profissional e responsiva para o produto SaaS **Controlai**, uma plataforma de gestão para pequenos negócios que reúne **estoque, vendas e finanças em um único painel**.

### Objetivo do produto

O Controlai transforma a gestão de pequenos negócios de "caos" em "controle". A interface deve transmitir simplicidade, confiança, organização e inteligência, sem parecer um sistema corporativo complexo.

Público-alvo:

* Pequenas lojas
* Salões de beleza
* Lanchonetes
* Oficinas
* Microempreendedores que atualmente usam caderno, planilhas e WhatsApp para administrar o negócio

### Direção visual

Use uma estética **SaaS moderna + dashboard financeiro**, com aparência premium, limpa e tecnológica.

Paleta:

* Fundo principal: `#0A1120`
* Cards/painéis: `#0F1930`
* Cards elevados: `#182238`
* Âmbar principal: `#E8A33D`
* Verde-água: `#34D9B4`
* Vermelho para alertas: `#E8604A`
* Texto principal: `#EDEFF3`
* Texto secundário: `#8892A6`

Tipografia:

* **Space Grotesk** para títulos
* **Inter** para textos e interface
* **IBM Plex Mono** para números, métricas e indicadores

Evite visual genérico de template. Não use fundo preto puro, excesso de gradientes, neon exagerado ou efeitos 3D desnecessários.

---

## 1. Layout principal

Crie um **dashboard desktop 1440px**, com possibilidade de adaptação para tablet e mobile.

Estrutura:

* Sidebar fixa à esquerda
* Header superior
* Área principal de conteúdo
* Cards com cantos levemente arredondados
* Espaçamento generoso
* Hierarquia visual clara

### Sidebar

Logo:
**Controlai**

Menu:

* Visão geral
* Vendas
* Estoque
* Financeiro
* Clientes
* Relatórios
* Configurações

Na parte inferior:

* Avatar do usuário
* Nome do negócio
* Plano atual
* Botão "Ajuda"

Use ícones lineares simples e consistentes.

---

## 2. Dashboard — Visão Geral

Header:

Título:
**Bom dia, João 👋**

Subtítulo:
**Aqui está o resumo do seu negócio hoje.**

No canto direito:

* Busca
* Notificações
* Avatar

### Cards de métricas

Criar quatro cards principais:

**Vendas hoje**
R$ 2.840,00
+12,5% vs. ontem

**Pedidos**
38
+8 hoje

**Estoque**
124 produtos
7 precisam de reposição

**Saldo em caixa**
R$ 8.420,00
+6,2% este mês

Cada card deve possuir:

* Ícone
* Valor em destaque
* Indicador de crescimento
* Pequeno gráfico ou sparkline

---

## 3. Gráfico de vendas

Criar um card grande:

**Vendas**

Gráfico de linha mostrando os últimos 7 dias.

Filtros:

* 7 dias
* 30 dias
* 3 meses
* 1 ano

Mostrar:

* Total vendido
* Ticket médio
* Quantidade de pedidos

O gráfico deve usar principalmente o âmbar e verde-água da identidade.

---

## 4. Alertas de estoque

Criar card:

**Estoque precisa de atenção**

Lista de produtos:

Produto | Estoque | Status | Ação

Exemplos:

* Coca-Cola 350ml | 4 un. | Estoque baixo | Repor
* Hambúrguer artesanal | 7 un. | Estoque baixo | Repor
* Batata frita 2kg | 2 un. | Crítico | Repor

Usar vermelho somente para situações críticas e âmbar para alertas.

Adicionar botão:
**Ver estoque completo**

---

## 5. Pedidos recentes

Criar uma tabela/card:

**Pedidos recentes**

Colunas:

* Pedido
* Cliente
* Data
* Valor
* Pagamento
* Status

Exemplos:
#1048 — Carlos Silva — Hoje 10:32 — R$ 185,00 — Pix — Concluído

Status devem utilizar badges discretos.

Adicionar:
**Ver todos os pedidos**

---

## 6. Financeiro

Criar uma seção específica para **Financeiro**.

Cards:

* Entradas
* Saídas
* Lucro
* Contas a receber

Criar gráfico comparando:
**Entradas x Saídas**

Adicionar seção:
**Fluxo de caixa**

Mostrar movimentações recentes com:

* Descrição
* Categoria
* Data
* Valor
* Entrada/Saída

---

## 7. Estoque

Criar uma tela completa de estoque.

Topo:
**Estoque**

Botão principal:
**+ Adicionar produto**

Filtros:

* Buscar produto
* Categoria
* Status
* Fornecedor

Tabela:

* Produto
* Categoria
* Estoque atual
* Estoque mínimo
* Preço
* Valor em estoque
* Status
* Ações

Criar indicadores visuais:

* Em estoque
* Estoque baixo
* Esgotado

Permitir visualizar rapidamente quais produtos estão parados ou próximos de acabar.

---

## 8. Vendas

Criar tela de vendas com:

Título:
**Vendas**

Botão:
**+ Nova venda**

Cards:

* Vendas hoje
* Ticket médio
* Pedidos
* Faturamento

Criar gráfico de vendas.

Tabela de pedidos com filtros por:

* Data
* Status
* Forma de pagamento
* Cliente

---

## 9. Nova venda

Criar uma tela/modal simples para registrar uma venda.

Elementos:

* Buscar produto
* Quantidade
* Carrinho
* Subtotal
* Desconto
* Total
* Forma de pagamento

Formas:

* Pix
* Dinheiro
* Cartão

Botão principal:
**Finalizar venda**

Ao finalizar, representar visualmente que o estoque é atualizado automaticamente.

---

## 10. Clientes

Criar tela:

**Clientes**

Cards:

* Total de clientes
* Novos clientes
* Clientes recorrentes
* Ticket médio

Tabela:

* Cliente
* Contato
* Última compra
* Total gasto
* Pedidos
* Status

---

## 11. Relatórios

Criar uma tela de relatórios com visual analítico.

Categorias:

* Vendas
* Estoque
* Financeiro
* Clientes

Criar gráficos e indicadores.

Adicionar botões:
**Exportar PDF**
**Exportar Excel**

---

## 12. Atendimento / WhatsApp

Criar uma área chamada:

**Atendimento**

Mostrar integração com WhatsApp.

Painel dividido em:

* Conversas
* Pedidos
* Agendamentos

Mostrar exemplo de conversa com cliente e pedido sendo automaticamente identificado pelo sistema.

Criar indicador:
**Pedidos recebidos pelo WhatsApp hoje: 14**

Adicionar botão:
**Conectar WhatsApp**

---

## 13. Experiência de uso

A interface deve priorizar:

* Poucos cliques
* Informações importantes imediatamente visíveis
* Botões claros
* Feedback visual após ações
* Estados de loading
* Estados vazios
* Mensagens de sucesso
* Alertas
* Confirmações antes de ações importantes

Criar componentes reutilizáveis:

* Buttons
* Cards
* Inputs
* Selects
* Tables
* Badges
* Modals
* Dropdowns
* Toast notifications
* Charts
* Sidebar
* Header

---

## 14. Responsividade

Criar versões:

* Desktop
* Tablet
* Mobile

No mobile:

* Sidebar transformada em menu inferior ou menu lateral recolhível
* Cards organizados verticalmente
* Tabelas adaptadas para cards
* Gráficos responsivos
* Botões com tamanho adequado para toque

---

## 15. Sensação da interface

A sensação final deve ser:

**"Eu consigo entender meu negócio de primeira."**

A interface não deve parecer complicada. O Controlai precisa transmitir que o usuário não precisa ser especialista em administração ou finanças para utilizar o sistema.

Use bastante espaço negativo, contraste bem definido e componentes consistentes.

Crie primeiro o **Design System**, depois as telas principais e, por fim, os estados de interação.

### Telas obrigatórias no protótipo

1. Login
2. Dashboard
3. Vendas
4. Nova venda
5. Estoque
6. Adicionar produto
7. Financeiro
8. Clientes
9. Relatórios
10. Atendimento/WhatsApp
11. Configurações

Crie também um **fluxo navegável entre as telas**, simulando a experiência real de uso do Controlai.

O resultado deve parecer um **produto SaaS real pronto para apresentação a clientes e investidores**, e não apenas um wireframe.
