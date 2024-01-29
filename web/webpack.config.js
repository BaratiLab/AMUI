/**
 * webpack.config.js
 */

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  watchOptions: {
    poll: true,
  },
  mode: 'development',
  entry: './src',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],

    // Allows for typescript module resolution.
    modules: ['node_modules', 'src'],

    // Expects that all dependencies are included as peer dependencies.
    // Published packages can use 'dependencies' however when developed locally
    // will need to installed locally.
    // symlinks: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
        }
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
};
