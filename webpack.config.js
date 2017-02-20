var path = require('path')
var webpack = require('webpack')
module.exports = {
  devtool: 'source-map',
  entry: {
    main: './src/components/app'
  },
  module: {
    loaders: [{
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
    filename: '[name].js'
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
}
