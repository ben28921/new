'use strict';

const Path = require('path');

const Fs = require('fs');

const { merge } = require('webpack-merge');

const Webpack = require('webpack');

const ServerConfig = require(Path.join(__dirname, 'config.json'));

const BaseConfig = require(Path.resolve(__dirname, 'webpack.base.config.js'));

module.exports = merge(BaseConfig, {

	mode: 'development',

	devServer: {

		port: ServerConfig.application.ports.dev,

		historyApiFallback: { // Handle for react rewrite settings

			rewrites: [{

				from: /.*/g,

				to: '/index.html'
			}]
		}

	},

	plugins: [

		new Webpack.DefinePlugin({

			'process.env': {

				NODE_ENV: JSON.stringify('development'),
			}
		})
	]
})