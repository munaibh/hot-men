import http from 'http'
import { port } from './config'

let currentApp = require('./server').default
let server = http.createServer(currentApp).listen(port, function () {
  const message = `Ready to rock! http://localhost:${port}`
  console.info('\x1b[45m I \x1b[49m', message)
})

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp)
    currentApp = require('./server').default
    server.on('request', currentApp)
  })
  
  module.hot.accept(err => console.info(err))
  module.hot.dispose(_ => {
    console.info('Disposing entry module...')
    server.close()
  })
}