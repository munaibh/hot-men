import express from 'express'
import path from 'path'
import helpers from './helpers'
import secure from './helpers/forceSecure'
import compression  from 'compression'
import HotLoader from '../config/plugins/HotLoader'

const app = express()

app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(helpers)
app.use(compression())
app.use(secure)

app.get('/', (req, res, next) => {
  res.render('index')
})

if(__DEV__) {
  HotLoader.watch(app)
}

export default app