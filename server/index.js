const http = require('http')
const _dotenv = require('dotenv').config()
const PORT = process.env.PORT || 8080

let currentApp = require('./server').default
let server = http.createServer(currentApp).listen(PORT, function () {
  const message = `Ready to rock! http://localhost:${PORT}`
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