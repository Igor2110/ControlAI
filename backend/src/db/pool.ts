import mysql, { type Pool, type PoolConnection, type ResultSetHeader } from 'mysql2/promise'
import { config } from '../config.js'

export const pool: Pool = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true, // DECIMAL vira number
  dateStrings: true, // DATE/DATETIME viram string, sem surpresas de fuso
})

type Executor = Pool | PoolConnection

export async function query<T = Record<string, any>>(sql: string, params: unknown[] = [], conn: Executor = pool): Promise<T[]> {
  const [rows] = await conn.query(sql, params)
  return rows as T[]
}

export async function one<T = Record<string, any>>(sql: string, params: unknown[] = [], conn: Executor = pool): Promise<T | undefined> {
  return (await query<T>(sql, params, conn))[0]
}

export async function exec(sql: string, params: unknown[] = [], conn: Executor = pool): Promise<ResultSetHeader> {
  const [result] = await conn.query(sql, params)
  return result as ResultSetHeader
}

/** Executa várias operações em uma transação (commit ou rollback automático). */
export async function transaction<T>(fn: (conn: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const result = await fn(conn)
    await conn.commit()
    return result
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
