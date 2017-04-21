const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

	entry: './src/index.ts',
	output: {
		filename: 'src/jquery.ui.swingdrag.min.js'
	},
	resolve: {
		extensions: ['.ts', '.js', '']
	},
	module: {
		loaders: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new UglifyJSPlugin()
	]

};