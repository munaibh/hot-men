import express from 'express'
import path from 'path'
import helpers from './helpers'

const app = express()

app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(helpers)

app.get('/', (req, res, next) => {
  res.render('index')
})

if(process.env.NODE_ENV === 'development') {
  const watcher = require('../config/plugins/HotLoader/watcher')
  watcher.static()
  watcher.client(app)
}

export default app