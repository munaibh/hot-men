const WebpackWatcher = function() {
  const path = require('path')
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')

  let devMiddleWareInstance, hotMiddleWareInstance

  const initClientWatcher = (instance) => {
    const env = { production: process.env.NODE_ENV === 'production', target: 'client' }
    const config = require('../../webpack.client.js')(env)
    const compiler = webpack(config)
    const publicPath = config.output.publicPath
    const options = { publicPath, logLevel: 'silent', log: false }

    devMiddleWareInstance = webpackDevMiddleware(compiler, options)
    hotMiddleWareInstance = webpackHotMiddleware(compiler, options)

    instance.use(devMiddleWareInstance)
    instance.use(hotMiddleWareInstance)
  }

  return {
    client: initClientWatcher,
  }
}

module.exports = WebpackWatcher()