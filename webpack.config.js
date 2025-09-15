const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './js/neurlyn-integrated.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.[contenthash].js',
    clean: true,
    publicPath: process.env.BASE_URL || '/'
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
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'styles', to: 'styles' },
        { from: 'assets', to: 'assets' },
        { from: 'js/neurlyn-integrated.js', to: 'js/neurlyn-integrated.js' },
        { from: 'js/neurlyn-enhanced.js', to: 'js/neurlyn-enhanced.js' },
        { from: 'js/neurlyn.js', to: 'js/neurlyn.js' },
        { from: 'js/report-generator.js', to: 'js/report-generator.js' },
        { from: 'js/modules', to: 'js/modules' },
        { from: 'js/tasks', to: 'js/tasks' },
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'sw.js', to: 'sw.js' },
        { from: 'backend.js', to: 'backend.js' },
        { from: 'package.json', to: 'package.json' }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3001,
    hot: true,
    open: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};