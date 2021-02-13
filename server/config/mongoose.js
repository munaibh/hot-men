import * as config from './index.js'
import mongoose from 'mongoose'

const resolveConnectionUrl = _ => {
  const { username, password, database, uri = '' } = config.mongoose
  if(!username && !password && !database && !uri) return
  return (uri === '') 
    ? `mongodb://${username}:${password}@mongo:27017/${database}?authSource=admin`
    : uri
}

const connectToDatabase = _ => {
  const connectionUrl = resolveConnectionUrl()
  const options = { useNewUrlParser: true, useUnifiedTopology: true }
  if(!connectionUrl) return console.info('\x1b[45m I \x1b[49m', 'MongoDB: Skipped (No Config)')

  return mongoose.connect(connectionUrl, options)
    .then(_ => console.info('\x1b[45m I \x1b[49m', 'MongoDB: Successfully connected'))
    .catch(_ => console.info('\x1b[45m I \x1b[49m', 'MongoDB: Failed to connect'))
}

export default { 
  connect: connectToDatabase,
}