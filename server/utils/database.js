import mongoose from 'mongoose'

/**
 * Handle and expose Mongoose connection method (read environment variables).
 * @public
 */
const MongooseConnector = _ => {
  const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, MONGO_URI } = process.env

  const resolveConnectionUrl = _ => {
    if(!MONGO_USERNAME && !MONGO_PASSWORD && !MONGO_DB && !MONGO_URI) return
    return (!MONGO_URI || MONGO_URI === '') 
      ? `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017/${MONGO_DB}?authSource=admin`
      : MONGO_URI 
  }

  const connect = _ => {
    const connectionUrl = resolveConnectionUrl()
    const options = { useNewUrlParser: true, useUnifiedTopology: true, }
    if(!connectionUrl) return console.log('\x1b[45m I \x1b[49m', 'MongoDB: Skipped (No Config)')
    mongoose.connect(connectionUrl, options)
      .then(_ => console.log('\x1b[45m I \x1b[49m', 'MongoDB: Successfully connected'))
      .catch(_ => console.log('\x1b[45m I \x1b[49m', 'MongoDB: Failed to connect'))
  }

  return { connect }
}

export default MongooseConnector()