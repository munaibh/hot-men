const http = require('http')
const PORT = process.env.PORT || 8080

let currentApp = require('./server')
let server = http.createServer(currentApp).listen(PORT, function () {
  console.info(`Server started on: http://localhost:${PORT}`)
})