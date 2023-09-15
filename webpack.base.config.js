"use strict";

const Path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const ServerConfig = require(Path.join(__dirname, "config.json"));

module.exports = {
	entry: {
		// web app
		app: Path.join(__dirname, "app", "src", "index.js"),
	},

	output: {
		filename: "[name].js",

		chunkFilename: "[name].bundle.js",

		path: Path.join(__dirname, "server", "dist"),

		publicPath: "/",
	},

	plugins: [
		// web frontend
		new HtmlWebpackPlugin({
			template: Path.join(__dirname, "app", "public", "index.html"),
			favicon: Path.join(__dirname, "app", "public", "favicon.png"),
		}),
	],

	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				include: [Path.join(__dirname, "app", "src")],
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							"@babel/preset-typescript",
						],
					},
				},
			},
			{
				test: /\.(sa|sc|c)ss$/, // styles files
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/, // to import images and fonts
				loader: "url-loader",
				options: {
					limit: false,
					name: "[name].[ext]",
					outputPath: "assets/images/",
				},
			},
		],
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},

	externals: {
		config: JSON.stringify({
			application: {
				apiEndpoint: ServerConfig.application.ajaxUrl,
			},
		}),
	},
};
