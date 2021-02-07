import express from 'express'
import path from 'path'
import compression  from 'compression'
import pugHelpers from './middlewares/pug-helpers'
import forceSecure from './middlewares/force-secure'
import hotLoader from '../build-utils/webpack-plugins/hot-loader'
import errors from './middlewares/error-handler'
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