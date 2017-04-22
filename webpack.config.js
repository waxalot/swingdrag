const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

	entry: './src/index.ts',
	output: {
		filename: 'jquery.ui.swingdrag.min.js'
	},
	resolve: {
		extensions: ['.ts', '.js', '', 'css', 'scss']
	},
	module: {
		loaders: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loader: "style!css"
			},
			{
				test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "sass-loader"]
			}
		]
	},
	plugins: [
		new UglifyJSPlugin()
	]

};