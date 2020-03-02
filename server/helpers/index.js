import path from 'path'
import fs from 'fs'

const tryCatch = (value, fallback)  => {
  const isFunc = typeof value === 'function'
  try { return isFunc ? value() : value }
  catch(e) { return fallback }
}

const fetchTag = _ => {
  const fallbackTag = '0.0.0-dev'
  const execDescribe = _ => cp.execSync('git describe --tags --dirty --abbrev=0', {cwd: '.'})
  const lastTag = tryCatch(execDescribe, fallbackTag).toString()
  return lastTag.replace(/-/g, '_').trim()
}

const PugHelpers = function() {
  const version = fetchTag()
  const environment = process.env.NODE_ENV || 'development'
  
  let manifest = initialise()

  function initialise() {
    if (environment !== 'production') return {}
    const filePath = path.join(__dirname, '..', '..', 'public', 'manifest.json')
    const config = { encoding: 'utf-8', flag: 'r' }
    return tryCatch(JSON.parse(fs.readFileSync(filePath, config)), {})
  }

  function middleware(req, res, next) {
    res.locals.version = version
    res.locals.environment = environment
    res.locals.asset = path => manifest[path] ? manifest[path] : path
    next()
  }

  return middleware
}

export default PugHelpers()