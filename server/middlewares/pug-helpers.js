import { parseManifestAsJson, fetchAssetContents, fetchAssetPath } from '@server/utils/manifest' 

/**
 * Pug middleware to make useful functions and utils accessible.
 * @public
 */

const PugEngineMiddleware = _ => {
  const version = process.env.VERSION || '???'
  const environment = process.env.NODE_ENV || 'development'
  const manifest = parseManifestAsJson()

  return (_req, res, next) => {
    res.locals.version = version
    res.locals.environment = environment
    res.locals.pretty = __DEV__
    res.locals.inline = fetchAssetContents(manifest)
    res.locals.asset = fetchAssetPath(manifest)
    next()
  }
}


export default PugEngineMiddleware()