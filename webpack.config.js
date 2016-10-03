const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge             = require('webpack-merge');
const validate          = require('webpack-validator');
const parts             = require('./libs/parts');

const PATHS = {
  app:   path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
// Entry accepts a path or an object of entries.
// We'll be using the latter form given it's
// convenient with more complex configurations.
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          // This is used for require.ensure. The setup
          // will work without but this is useful to set.
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.setupCSS(PATHS.app),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify()
    )
    break;
  default:
    config = merge(
      common,
      parts.setupCSS(PATHS.app),
      {
        devtool: 'eval-source-map'
      },
      parts.devServer({
        // customize host or port here if needed
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

module.exports = validate(config);
