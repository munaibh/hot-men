import path from 'path'
import fs from 'fs'

/**
 * Try/Catch wrapper providing fallback value on failure.
 * @private
 */
const tryWithFallback = (value, fallback)  => {
  const isFunc = typeof value === 'function'
  try { return isFunc ? value() : value }
  catch(e) { return fallback }
}

/**
 * Resolve any useful metadata and return it.
 * @public
 */
export const fetchMetaData = _ => {
  const version = process.env.VERSION || '???'
  const environment = process.env.NODE_ENV || 'development'
  return { version, environment}
}

/**
 * Manifest handler, fetch manifest and parse as json (only in production).
 * @public
 */
export const parseManifestAsJson = _ => {
  if(__DEV__) return {}
  const filePath = path.join(process.cwd(), 'public', 'manifest.json')
  const fsConfig = {  encoding: 'utf-8', flag: 'r' }
  const fileContents = fs.existsSync(filePath) ? fs.readFileSync(filePath, fsConfig) : undefined
  return tryWithFallback(
    JSON.parse(fileContents), {}
  )
}

/**
 * Retrieve raw file contents and store if accessed before.
 * @public
 */
export const fetchAssetContents = manifest => {
  const contentCache = {}
  return (url) => {
    if(contentCache[url]) return contentCache
    const assetPath = manifest[url] ? manifest[url] : url
    const filePath = path.join(process.cwd(), 'public', assetPath)
    const fileContents = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : undefined
    return tryWithFallback(
      fileContents.trim(), {}
    )
  }
}

/**
 * Retrieve file path from manifest, if undefined return requested url.
 * @public
 */
export const fetchAssetPath = manifest => url => {
  return manifest[url] ? manifest[url] : url
}


export default {
  parseManifestAsJson,
  fetchMetaData,
  fetchAssetContents,
  fetchAssetPath,
}