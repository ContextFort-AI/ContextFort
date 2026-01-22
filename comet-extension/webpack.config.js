const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
    content: './content.js',
    popup: './popup.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.POSTHOG_KEY': JSON.stringify(process.env.POSTHOG_KEY)
    }),
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'popup.html', to: 'popup.html' },
        { from: 'rules.json', to: 'rules.json' },
        { from: 'icon128.png', to: 'icon128.png' },
        { from: 'icon48.png', to: 'icon48.png' },
        { from: 'icon16.png', to: 'icon16.png' },
        {
          from: 'dashboard',
          to: 'dashboard',
          globOptions: {
            ignore: ['**/mock-storage-data.json']
          }
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};
