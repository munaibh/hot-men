const webpack = require('webpack')
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')
const { flattenEntryPoints } = require('./webpack-plugins/webpack-plugin-utils')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ManifestPlugin = require('./webpack-plugins/manifest-plugin')
const ServiceWorkerPlugin = require('./webpack-plugins/service-worker-plugin')

module.exports = (env, _argv) => {
  const environment = env.production ? 'production' : 'development'
  const entries = env.production ? [] : ['./build-utils/webpack-plugins/hot-loader/subscribe']
  const filename = env.production ? '[name].[contenthash:8]' : '[name]'
  const cleanWhiteList = ['!offline.html', '!web-manifest.json', '!favicon.png']

  const entrypoints = {
    main: [...entries, './client/index' ],
    critical: ['./client/styles/critical.sass'] ,
    style: ['./client/styles/style.sass'],
  }

  return {
    mode: environment,
    entry: env.production ? entrypoints : flattenEntryPoints(entrypoints),
    output: {
      path: path.resolve(__dirname, '..', "public"),
      publicPath: '/',
      filename: `scripts/${filename}.js`,
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
      }, {
        test: /\.(png|jpe?g|gif)$/i,
        use: [{
          loader: 'file-loader',
          options: { name: `images/${filename}.[ext]`, publicPath: '/' }
        }]
      }, {
        test: /\.(sa|sc|c)ss$/,
        use: [ 
          { loader: MiniCssExtractPlugin.loader, options: { hmr: !env.production } }, 
          'css-loader', 
          { loader: 'sass-loader', options: { prependData: `$env: "${environment}";`} }
        ],
      }],
    },
    plugins: [
      new ESLintPlugin({ context: path.resolve(process.cwd(), 'client') }),
      new webpack.DefinePlugin({ __DEV__: !env.production }),
      new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', ...cleanWhiteList] }),
      new MiniCssExtractPlugin({ filename: `styles/${filename}.css` }),
      new ManifestPlugin(),
      new ServiceWorkerPlugin(),
      ...env.production ? []: [
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsPlugin(),
      ],
    ]
  }
}