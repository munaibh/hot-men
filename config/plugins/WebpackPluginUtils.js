const path = require('path')
const cp = require('child_process');

const PluginUtils = function()  {
  let cachedVersion
  
  const tryWithFallback = (callback, fallback)  => {
    try { return callback() }
    catch(e) { return fallback }
  }

  const packageVersion = () => {
    var packageJSON = require('../../package.json')
    return packageJSON.version || '0.0.0-dev'
  }
  
  const version = () => {
    if(cachedVersion) return cachedVersion
    const fallbackTag = packageVersion()
    const execDescribe = _ => cp.execSync('git describe --tags --dirty --abbrev=0', {cwd: '.'})
    const lastTag = tryWithFallback(execDescribe, fallbackTag).toString()
    cachedVersion = lastTag.replace(/-/g, '_').trim()
    return cachedVersion
  }

  return { tryWithFallback, version }
}

module.exports = PluginUtils()