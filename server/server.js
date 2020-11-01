import express from 'express'
import path from 'path'
import compression  from 'compression'
import pugHelpers from './middlewares/pugHelpers'
import forceSecure from './middlewares/forceSecure'
import hotLoader from '../config/plugins/HotLoader'
import errors from './middlewares/errorHandler'
import database from './utils/database'

const app = express()
const _dbInstance = database.connect()
const _compiler = __DEV__ && hotLoader.watch(app)

app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(pugHelpers)
app.use(compression())
app.use(forceSecure)

app.use('/', require('./routes').default)

app.use(errors.notFound)
app.use(errors.handler)

export default app