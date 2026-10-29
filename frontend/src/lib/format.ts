export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const num = (n: number) => n.toLocaleString('pt-BR')

// As datas chegam como 'YYYY-MM-DD' ou 'YYYY-MM-DD HH:MM:SS'; formatamos sem passar por Date (evita erro de fuso).
export const dateBR = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}`
export const dateTimeBR = (s: string) => `${dateBR(s)} ${s.slice(11, 16)}`

export const paymentLabel = { pix: 'Pix', dinheiro: 'Dinheiro', cartao: 'Cartão' } as const
