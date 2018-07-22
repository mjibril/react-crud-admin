

"use strict";
var webpack = require('webpack');
var path = require('path');
///var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "9999";


var loaders = [
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components|public)/,
		loader: 'babel-loader',
	
	},
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: "file-loader"
	},
	{
		test: /\.(woff|woff2)$/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?prefix=font/&limit=5000"
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=application/octet-stream"
	},
	{
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=image/svg+xml"
	},
	{
		test: /\.gif/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=image/gif"
	},
	{
		test: /\.jpg/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=image/jpg"
	},
	{
		test: /\.png/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=image/png"
	},
        {
        test: /\.(sa|sc|c)ss$/,
        use: [
             MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
        ],
	},

       {
	test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
	loader : 'file-loader'

       }
];

module.exports = {
    optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
    entry: [

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
	new MiniCssExtractPlugin({
	    // Options similar to the same options in webpackOptions.output
	    // both options are optional
	    filename: '[name].css',
	    chunkFilename: '[id].css',
	    publicPath: './public'
}),	        

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

