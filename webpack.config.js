const webpack = require('webpack')
const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

var domain;
var mode = "development";
// Provide your Google API Key here or from the commandline:
// $ GOOGLE_API_KEY=<Your API Key> npm run build:<env>
// env can be prod or dev
var gapi_key = "GOOGLE_API_KEY";

var setupEnvVars = function() {
  switch (process.env.ENV) {
      case 'prod':
          domain = "'https://younonstop.com'";
          mode = "production";
          break;
      default:
          domain = "'http://localhost:8000'";
          mode = "development";
          break;
  }

  if (!process.env.GOOGLE_API_KEY && !gapi_key) {
      throw new Error("Google API is missing. Please provide Google API Key.");
  }

  gapi_key = "'" + process.env.GOOGLE_API_KEY + "'";
}

setupEnvVars();

const config = {
    entry: "./app/js/main.js",
    mode: mode,
    output: {
        path: path.resolve(__dirname, 'dist'),  // absolute file path
        filename: 'bundle.js',
        publicPath: '/'
    },
    module : {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                use: ['style-loader', 'css-loader'],
                test: /\.css$/
            }
        ]
    },
    plugins : [
        new webpack.DefinePlugin({
            __DOMAIN__: domain,
            __GOOGLE_API_KEY__: gapi_key,
        }),
        new HTMLWebpackPlugin({
            template: './app/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        }),
        new CopyWebpackPlugin([
            "./app/assets/img/ico/ico.png"
        ]),
    ]
}

module.exports = config;