var path = require('path')

module.exports = {
  debug: true,
  entry: './src/app',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel?cacheDirectory',
      exclude: /node_modules/
    },
    {
      test: /\.scss$/,
      loaders: [
        'style',
        'css',
        'sass'
      ]
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
