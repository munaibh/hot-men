import path from 'path'
import { version, env } from '@server/config'
import manifest from '@server/services/manifest.service'

const PugLocalsMiddleware = _ => {
  const manifestPath = path.join(process.cwd(), 'public', 'manifest.json')
  const manifestJson = manifest.fetch(manifestPath)

  return (_req, res, next) => {
    res.locals.version = version
    res.locals.environment = env
    res.locals.pretty = __DEV__
    res.locals.inline = manifest.contents(manifestJson)
    res.locals.asset = manifest.path(manifestJson)
    next()
  }
}

export default PugLocalsMiddleware