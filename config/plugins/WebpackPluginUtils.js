const PluginUtils = function()  {
  let cachedVersion = process.env.HEROKU_RELEASE_VERSION
  
  const tryWithFallback = (callback, fallback)  => {
    try { return callback() }
    catch(e) { return fallback }
  }
  
  const version = () => {
    if(cachedVersion) return cachedVersion
    const fallbackTag = '0.0.0-dev'
    const execDescribe = _ => cp.execSync('git describe --tags --dirty --abbrev=0', {cwd: '.'})
    const lastTag = tryWithFallback(execDescribe, fallbackTag).toString()
    return cachedVersion = lastTag.replace(/-/g, '_').trim()
  }

  return { tryWithFallback, version
  }
}

module.exports = PluginUtils()