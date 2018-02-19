const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = {
  entry: {
    app: ['babel-polyfill', './src/app/index.tsx'],
    styles: ['./src/style/main.scss']
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.ejs']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.s?css$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      hash: true,
      cache: true,
      chunksSortMode: 'dependency',
      minify: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && (module.context.indexOf('node_modules') !== -1 || module.context.indexOf('bower_components') !== -1)
    })
  ],
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};

const devConfig = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [/node_modules/]
      }
    ]
  }
};

const prodConfig = {
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      hash: true,
      cache: true,
      chunksSortMode: 'dependency',
      minify: {
        caseSensitive: false,
        collapseWhitespace: true,
        html5: true,
        minifyURLs: true
      }
    }),
    new UglifyJsPlugin({
      parallel: 8,
      sourceMap: false,
      uglifyOptions: {
        ecma: 5,
        ie8: false,
        keep_fnames: false,
        mangle: true,
        toplevel: true,
        output: {
          beautify: false,
          comments: false
        },
        compress: {
          passes: 3,
          drop_console: true
        }
      }
    })
  ]
};

module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    return merge.smart(baseConfig, prodConfig);
  } else {
    return merge.smart(baseConfig, devConfig);
  }
};