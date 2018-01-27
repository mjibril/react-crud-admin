

"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "9999";


/*

	`webpack-dev-server/client?http://${HOST}:${PORT}`,
		`webpack/hot/only-dev-server`,
	
*/
module.exports = {
    entry: [
	'whatwg-fetch',
	'./src/admin.js' // Your appʼs entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
	output: {
		path: path.join(__dirname, 'public'),
	    filename: 'bundle.js',
	    libraryTarget: 'commonjs2'
	},
    externals: { 'react': 'commonjs react' },

    resolve: {
	extensions: [ '.less', '.scss', '.css', '.js', '.json'],
	modules: [
	    'node_modules',
	    path.resolve(__dirname, './node_modules')
	],
	moduleExtensions: ['-loader'],
    },

    module: {
	rules:
	loaders
    },
	devServer: {
	    contentBase: "./public",
	    // do not print bundle build stats
	    noInfo: true,
	    // enable HMR
	    hot: true,
	    // embed the webpack-dev-server runtime into the bundle
	    inline: true,
	    // serve index.html in place of 404 responses to allow HTML5 history
	    historyApiFallback: true,
	    port: PORT,
	    host: HOST
	},
	plugins: [
	    new webpack.NoEmitOnErrorsPlugin(),
	    new webpack.HotModuleReplacementPlugin(),
	    new HtmlWebpackPlugin({
		template: './src/index.html'
	    }),
	    
	    new webpack.ProvidePlugin({
		jQuery: 'jquery',
		$: 'jquery',
		jquery: 'jquery',
		"window.jQuery": "jquery",

	    })
	]

    
};

