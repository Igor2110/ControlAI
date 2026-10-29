import { one } from '../db/pool.js'

/** Data de hoje segundo o relógio do banco ('YYYY-MM-DD'). Usar a mesma fonte evita divergência de fuso. */
export async function today(): Promise<string> {
  return (await one<{ d: string }>('SELECT CURDATE() AS d'))!.d
}
