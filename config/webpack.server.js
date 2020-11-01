const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin-next')

module.exports = (env, argv) => {
  const environment = env.production ? 'production' : 'development'
  const entries = env.production ? [] : ['webpack/hot/poll?1000']
  const inspect = argv.includes('--inspect') ? ' --inspect' : ''
  const scripts = [`node${inspect} ./build/server.js`]
  const externals = nodeExternals({ whitelist: entries })
  const version = require('./plugins/WebpackPluginUtils').version()

  return {
    mode: environment,
    devtool: 'cheap-source-map',
    entry: [...entries, './server/index'],
    target: 'node',
    node: { __dirname: true },
    watch: !env.production,
    watchOptions: { ignored: path.resolve(__dirname) },
    externals: externals,
    output: {
      path: path.resolve(__dirname, '..', 'build'),
      filename: 'server.js',
      hotUpdateChunkFilename: '.hot/[id].[hash].hot-update.js',
      hotUpdateMainFilename: '.hot/[hash].hot-update.json'
    },
    resolve: {
      alias: {
        '@config': path.resolve(process.cwd(), 'config'),
        '@client': path.resolve(process.cwd(), 'client'),
        '@public': path.resolve(process.cwd(), 'public'),
        '@server': path.resolve(process.cwd(), 'server'),
      }
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
      new webpack.DefinePlugin({ __DEV__: !env.production }),
      new webpack.EnvironmentPlugin({ NODE_ENV: environment, VERSION: version }),
      new CleanWebpackPlugin(),
      ...env.production ? []: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackShellPlugin({ onBuildEnd: { scripts, parallel: true } }),
        new FriendlyErrorsPlugin(),
      ],
    ],
  }
}