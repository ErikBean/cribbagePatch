var path = require('path')
var webpack = require('webpack')
module.exports = () => ({
  devtool: 'source-map',
  entry: {
    hmr: ['react-hot-loader/patch',
    // activate HMR for React

      'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

      'webpack/hot/only-dev-server'
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    ],
    bundle: './src/components/app'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader?cacheDirectory',
      exclude: /node_modules/
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url-loader?limit=8192'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
                   // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    })
  ],
  externals: []
})
