const path = require('path');

module.exports = {
  entry: './src/popup.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'checkList')
  },
  module:{
  	rules: [
		{
		    test: /\.(scss)$/,
		    use: [{
		      loader: 'style-loader', // inject CSS to page
		    }, {
		      loader: 'css-loader', // translates CSS into CommonJS modules
		    }, {
		      loader: 'postcss-loader', // Run post css actions
		      options: {
		        plugins: function () { // post css plugins, can be exported to postcss.config.js
		          return [
		            require('precss'),
		            require('autoprefixer')
		          ];
		        }
		      }
		    }, {
		      loader: 'sass-loader' // compiles Sass to CSS
		    }]
		},
		{
		  // Transform our own .css files with PostCSS and CSS-modules
		  test: /\.css$/,
		  exclude: /node_modules/,
		  use: ['style-loader', 'css-loader'],
		}, {
		  // Do not transform vendor's CSS with CSS-modules
		  // The point is that they remain in global scope.
		  // Since we require these CSS files in our JS or CSS files,
		  // they will be a part of our compilation either way.
		  // So, no need for ExtractTextPlugin here.
		  test: /\.css$/,
		  include: /node_modules/,
		  use: ['style-loader', 'css-loader'],
		}
  	]
  }
};