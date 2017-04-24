module.exports = {

	entry: './src/index.ts',
	output: {
		filename: 'jquery.ui.swingdrag.js'
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
	}

};