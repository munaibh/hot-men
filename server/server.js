import express from 'express'
import path from 'path'
import helpers from './helpers'
import secure from './helpers/forceSecure'
import compression  from 'compression'
import hotLoader from '../config/plugins/HotLoader'
import database from './lib/database'

const app = express()
const _dbInstance = database.init()
const _compiler = __DEV__ && hotLoader.watch(app)

app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(helpers)
app.use(compression())
app.use(secure)

app.get('/', (_req, res, _next) => {
  res.render('index')
})

app.use((_req, _res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use((err, _req, res, _next) => {
  const { status = 500, stack = '', message } = err
  const highlighted = stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  const details = { message, status, stack: { raw: stack, highlighted } }

  res.status(status)
  res.format({
    'text/html': () => res.render('error', details),
    'application/json': () => res.json(details)
  })
})

export default app