const path = require("path")
const cp = require('child_process')

const tryWithFallback = (callback, fallback)  => {
  try { return callback() }
  catch(e) { return fallback }
}

module.exports = class ServiceWorkerPlugin {
  constructor({output, template} = {}) {
    this.pluginName = 'webpackServiceWorkerPlugin'
    this.template = template || './client/service-worker.js'
    this.output = output || 'service-worker.js'
  }

  get tag() {
    const fallbackTag = '0.0.0-dev'
    const execDescribe = _ => cp.execSync('git describe --tags --dirty --abbrev=0', {cwd: '.'})
    const lastTag = tryWithFallback(execDescribe, fallbackTag).toString()
    return lastTag.replace(/-/g, '_').trim()
  }

  replace(compilation, path) {
    const data = require("fs").readFileSync(path, "utf8")
    const manifest = compilation.assets['manifest.json'].source()
    return data
      .replace('$VERSION', this.tag)
      .replace('$MANIFEST', manifest);
  }

  apply(compiler) {
    compiler.hooks.emit.tap(this.pluginName, compilation => {
      const template = path.join(compiler.context, this.template)
      const content = this.replace(compilation, template)
      compilation.fileDependencies.add(template);
      compilation.assets[this.output] = {
        source:() => content,
        size: () => content.length,
      }
    })
  }
}