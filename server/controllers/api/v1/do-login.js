"use strict";

const Path = require("path");

const Async = require("async");

const Fs = require("fs");

const Axios = require("axios");

const Moment = require("moment");

const Crypto = require("crypto");

//const Jwt = require('jsonwebtoken');
const Jose = require("jose");

const Validator = require("19json-validator");

/**
 * generate tokens
 */
const generateTokens = async (input) => {
	// input
	input = input || {};

	// validate
	Validator.validate(input, {
		// database
		knex: { type: "function" },

		// config
		config: { type: "object" },

		// user id
		userId: { type: ["string", "number"], regex: /^[1-9][0-9]*$/ },

		// // access token expire seconds
		// accessTokenExpireSeconds: { optional: true, type: 'number' },

		// // refresh token expire seconds
		// refreshTokenExpireSeconds: { optional: true, type: 'number' }
	});

	// config
	const config = input.config;

	// knex
	const knex = input.knex;

	// access token expire seconds
	const accessTokenExpireSeconds =
		config.application.token.accessTokenExpireSeconds;

	// refresh token expire seconds
	const refreshTokenExpireSeconds =
		config.application.token.refreshTokenExpireSeconds;

	// get user
	const user = await knex
		.table("t_admins")

		.where("r_id", input.userId)

		.whereNull("r_deleted_at")

		.first();

	// permissions
	let permissions = [];

	// await knex
	// 	.table("t_admin_car_parks_permissions")

	// 	.where("r_admin_id", input.userId)

	// 	.whereNull("r_deleted_at")

	// 	.select("r_car_park_id", "r_read", "r_write")

	// 	.then(async (m) => {
	// 		m.forEach((item) => {
	// 			if (item.r_read === 1) {
	// 				permissions.push(`GET /parking/${item.r_car_park_id}`);
	// 			}

	// 			if (item.r_write === 1) {
	// 				permissions.push(`POST /parking/${item.r_car_park_id}`);
	// 			}
	// 		});
	// 	});

	// await knex
	// 	.table("t_admin_permissions")

	// 	.where("r_admin_id", input.userId)

	// 	.whereNull("r_deleted_at")

	// 	.select("r_code", "r_read", "r_write")

	// 	.then(async (m) => {
	// 		m.forEach((item) => {
	// 			if (item.r_code === "SUPERADMIN") {
	// 				permissions.push(item.r_code);
	// 			} else {
	// 				if (item.r_read === 1) {
	// 					permissions.push(`GET ${item.r_code}`);
	// 				}

	// 				if (item.r_write === 1) {
	// 					permissions.push(`POST ${item.r_code}`);
	// 				}
	// 			}
	// 		});
	// 	});
	// only unique permission
	permissions = [...new Set(permissions)];

	const accessToken = await new Jose.SignJWT({
		id: user.r_id,

		username: user.r_username,

		type: "ACCESS_TOKEN",

		name: user.r_name,

		email: user.r_email,

		scopes: permissions,

		exp: Math.floor(Date.now() / 1000) + accessTokenExpireSeconds,
	})
		.setProtectedHeader({ alg: "HS256" })
		.sign(new TextEncoder().encode(config.application.secret));

	const refreshToken = await new Jose.SignJWT({
		id: user.r_id,

		username: user.r_username,

		type: "REFRESH_TOKEN",

		name: user.r_name,

		email: user.r_email,

		scopes: permissions,

		exp: Math.floor(Date.now() / 1000) + refreshTokenExpireSeconds,
	})
		.setProtectedHeader({ alg: "HS256" })
		.sign(new TextEncoder().encode(config.application.secret));

	// return
	return {
		user: user,

		accessToken: accessToken,

		refreshToken: refreshToken,
	};
};

/**
 * @api {post} /do-login login
 * @apiDescription login
 * @apiName login
 * @apiGroup do
 * @apiPermission POST /do-login
 *
 * @apiParam {string} email email
 * @apiParam {string} password password
 */
module.exports = {
	/**
	 * generate tokens
	 */
	generateTokens: generateTokens,

	/**
	 * module handler
	 */
	execute: async (ctx) => {
		// result object
		let result = {};

		// config
		let config = ctx.config;

		// bunyan
		let log = ctx.log;

		// knex
		let knex = ctx.knex;

		// knex transaction
		let transaction = undefined; // await knex.transaction();

		// main workflow
		try {
			// token
			// const token = ctx.request.token;

			// params
			const params = ctx.request.params;

			// input
			let input = {
				// query
				// ...(ctx.request.query || {}),

				// body
				...(ctx.request.body || {}),
			};
			console.log("hi", input);
			// validate url id
			Validator.validate(params, {
				// id: { optional: true, type: ['string', 'number'], regex: /^[1-9][0-9]*$/ }
			});

			// validate
			Validator.validate(input, {
				// username
				f_username: { type: "string", empty: false },

				// password
				f_password: { type: "string", empty: false },
			});

			// get user
			const user = await knex
				.table("t_admins")

				.where("r_username", input.f_username)

				.whereNull("r_deleted_at")

				.first();
			console.log("hi1", user);
			// user not found
			if (typeof user === "undefined") {
				throw new Error("user not found");
			}

			// raw password
			const rawPassword = input.f_password;

			// user input password
			const inputPassword = Crypto.createHmac(
				"sha512",
				config.application.secret
			)

				.update(rawPassword)

				.digest("hex");

			// incorrect password
			if (user.r_password !== inputPassword) {
				throw new Error("incorrect password");
			}

			// generate access token and refresh token
			const { accessToken, refreshToken } = await generateTokens({
				config: config,

				knex: knex,

				userId: user.r_id,
			});

			// add to result
			result = {
				...result,

				r_access_token: accessToken,

				r_refresh_token: refreshToken,
			};

			// commit
			transaction && transaction.commit();

			// send response
			return ctx.response.send({
				r_result: "success",

				...result,
			});
		} catch (err) {
			// error
			// rollback
			transaction && transaction.rollback();

			// log
			log.error(err);

			// send response
			return ctx.response.send({
				r_result: "failed",

				r_error: err.message,

				...result,
			});
		}
	},
};
