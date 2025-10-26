const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const config = {
    devtool: isProduction ? false : 'inline-source-map',
    entry: {
      'index': './src/index.ts'
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

  if (isProduction) {
    config.plugins.push(new WebpackObfuscator({
      rotateStringArray: true,
      stringArray: true,
      stringArrayThreshold: 0.75,
      debugProtection: true,
      selfDefending: true,
      splitStrings: true,
      splitStringsChunkLength: 5,
    }));
  }

  return config;
};
