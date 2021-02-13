import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || '4000'
const version = process.env.VERSION || '???'
const mongoose = {
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  db: process.env.MONGO_DB,
  uri: process.env.MONGO_URI,
}

export { env, port, version, mongoose }