
import path from 'path'
import fs from 'fs'

/**
 * Try/Catch wrapper providing fallback andvalue on failure.
 * @param {*} data
 * @param {string} type
 * @param {*} string
 * @returns {*}
 */

const parseWithFallback = (data, type, fallback) => {
  try { return type === 'json' ? JSON.parse(data) : data }
  catch(e) { return  fallback }
}

/**
 * Manifest handler, fetch manifest and parse as json (only in production).
 * @param {string} filePath
 * @param {boolean} isProduction
 * @returns {Object}
 */
const fetchManifestAsJson = (filePath, isProduction) => {
  if(isProduction) return {}
  const fileExists = fs.existsSync(filePath) 
  const fileConfig = { encoding: 'utf-8', flag: 'r' }
  const fileContents = fileExists ? fs.readFileSync(filePath, fileConfig) : undefined
  return parseWithFallback(fileContents, 'json', {})
}

/**
 * Retrieve raw file contents from provided path.
 * @param {Object} manifestJson
 * @param {string} assetUrl
 * @returns {string}
 */
const fetchAssetContents = (manifestJson) => (assetUrl) => {
  const assetPath = manifestJson[assetUrl] ? manifestJson[assetUrl] : assetUrl
  const filePath = path.join(process.cwd(), 'public', assetPath)
  const fileExists = fs.existsSync(filePath) 
  const fileContents = fileExists ? fs.readFileSync(filePath, 'utf-8') : undefined
  return parseWithFallback(fileContents.trim(), 'text', '')
}

/**
 * Retrieve file path from manifest, if undefined return requested url.
 * @param {Object} manifestJson
 * @param {string} assetUrl
 * @returns {string}
 */
const fetchAssetPath = (manifestJson) => (assetUrl) => {
  return manifestJson[assetUrl] ? manifestJson[assetUrl] : assetUrl
}

export { fetchManifestAsJson, fetchAssetContents, fetchAssetPath }

export default {
  fetch: fetchManifestAsJson,
  contents: fetchAssetContents,
  path: fetchAssetPath,
}