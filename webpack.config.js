var path = require('path')

module.exports = {
  debug: true,
  devtool: 'source-map',
  entry: './src/app',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel?cacheDirectory',
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
    filename: 'bundle.js'
  },
  plugins: [],
  externals: []
}
