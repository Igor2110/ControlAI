import { createApp } from './app.js'
import { config } from './config.js'

createApp().listen(config.PORT, () => {
  console.log(`API do Controlai rodando em http://localhost:${config.PORT}/api`)
})
