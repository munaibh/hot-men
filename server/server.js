import express from 'express'
import path from 'path'
import compression  from 'compression'
import templateEgine from './middlewares/template'
import forceSecure from './middlewares/forceSecure'
import hotLoader from '../build-utils/webpack-plugins/hot-loader'
import mongoose from './config/mongoose'
import { notFoundHandler, errorHandler } from './middlewares/error'

const app = express()
const _dbInstance = mongoose.connect()
const _compiler = __DEV__ && hotLoader.watch(app)

app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(templateEgine())
app.use(compression())
app.use(forceSecure)

app.use('/', require('./routes').default)

app.use(notFoundHandler)
app.use(errorHandler)

export default app