var webpack = require('webpack');  
module.exports = {  
  entry: [
    "./js/app.js",
    "whatwg-fetch"
  ],
  output: {
    path: __dirname + '/static',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
  	new webpack.DefinePlugin({
    	'process.env.BROWSER': JSON.stringify(true),
  	})
  ]
};
