const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = (env, _argv) => {
  const environment = env.production ? 'production' : 'development'
  const entries = env.production ? [] : ['webpack/hot/poll?1000']
  const externals = nodeExternals({ whitelist: entries })

  return {
    mode: environment,
    devtool: 'cheap-source-map',
    entry: [...entries, './server/index'],
    target: 'node',
    node: { __dirname: true },
    watch: !env.production,
    externals: externals,
    output: {
      path: path.resolve(__dirname, '..', 'build'),
      filename: 'server.js',
      hotUpdateChunkFilename: '.hot/[id].[hash].hot-update.js',
      hotUpdateMainFilename: '.hot/[hash].hot-update.json'
    },
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }],
    },
    stats: 'errors-only',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],
  }
}