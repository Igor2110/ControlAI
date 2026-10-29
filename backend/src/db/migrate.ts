import { readFile } from 'node:fs/promises'
import mysql from 'mysql2/promise'
import { config } from '../config.js'

const schema = await readFile(new URL('../../sql/schema.sql', import.meta.url), 'utf8')
const conn = await mysql.createConnection({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  multipleStatements: true,
})
await conn.query(schema)
await conn.end()
console.log('Tabelas criadas/atualizadas com sucesso.')
