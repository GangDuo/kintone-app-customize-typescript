const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    'sample': './src/sample.ts',
    'crc32': './src/crc32.ts',
    'trace-back-to-grandparents': './src/trace-back-to-grandparents.ts'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    fallback: {
      buffer: require.resolve('buffer')
    }
  },

  module: {
    rules: [{test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/}],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
  ]
};