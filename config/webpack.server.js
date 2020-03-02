const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = (env, _argv) => {
  const environment = env.production ? 'production' : 'development'
  const externals = nodeExternals()

  return {
    mode: environment,
    devtool: 'cheap-source-map',
    entry: ['./server/index'],
    target: 'node',
    node: { __dirname: true },
    externals: externals,
    output: {
      path: path.resolve(__dirname, '..', 'build'),
      filename: 'server.js'
    },
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }],
    },
    stats: 'errors-only',
    plugins: [],
  }
}