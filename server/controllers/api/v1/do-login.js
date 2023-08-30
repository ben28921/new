"use strict";

const Path = require("path");

const Async = require("async");

const Fs = require("fs");

const Axios = require("axios");

const Moment = require("moment");

const Crypto = require("crypto");

const Jose = require("jose");

const Validator = require("19json-validator");
const { config } = require("process");
const { default: knex } = require("knex");

const generateTokens = async (input) => {
	input = input || {};

	Validator.validate(input, {
		knex: { type: "function" },
		config: { type: "object" },
		userId: { type: ["string", "number"], regex: /^[1-9][0-9]*$/ },
	});

	const config = input.config;

	const knex = input.knex;

	const accessTokenExpireSeconds =
		config.application.token.accessTokenExpireSeconds;

	const refreshTokenExpireSeconds =
		config.application.token.refreshTokenExpireSeconds;

	const user = await knex
		.table("t_users")

		.where("r_id", input.userId)

		// .whereNull("r_deleted_at")

		.first();

	let permission = [];

	permission = [...new Set(permission)];

	const accessToken = await new Jose.SignJWT({
		id: user.r_id,

		username: user.r_name,

		type: "ACCESS_TOKEN",

		name: user.r_name,

		email: user.r_email,

		scopes: permission,

		exp: Math.floor(Date.now() / 1000) + accessTokenExpireSeconds,
	})
		.setProtectedHeader({ alg: "HS256" })
		.sign(new TextEncoder().encode(config.application.secret));

	const refreshToken = await new Jose.SignJWT({
		id: user.r_id,

		username: user.r_name,

		type: "REFRESH_TOKEN",

		name: user.r_name,

		email: user.r_email,

		scopes: permission,

		exp: Math.floor(Date.now() / 1000) + refreshTokenExpireSeconds,
	})
		.setProtectedHeader({ alg: "HS256" })
		.sign(new TextEncoder().encode(config.application.secret));

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
	generateTokens: generateTokens,

	execute: async (ctx) => {
		let result = {};

		let config = ctx.config;

		let log = ctx.log;

		let knex = ctx.knex;

		let transaction = undefined;

		try {
			const params = ctx.request.params;

			let input = { ...(ctx.request.body || {}) };

			Validator.validate(params, {});

			Validator.validate(input, {
				f_username: { type: "string", empty: false },
				f_password: { type: "string", empty: false },
			});

			const user = await knex
				.table("t_users")
				.where("r_name", input.f_username)
				// .whereNull("r_deleted_at")
				.first();

			if (typeof user === "undefined") {
				throw new Error("user not found");
			}

			const rawPassword = input.f_password;

			const inputPassword = Crypto.createHmac(
				"sha512",
				config.application.secret
			)
				.update(rawPassword)
				.digest("hex");

			if (user.r_password !== inputPassword) {
				throw new Error("incorrect password");
			}

			const { accessToken, refreshToken } = await generateTokens({
				config: config,

				knex: knex,

				userId: user.r_id,
			});

			result = {
				...result,

				r_access_token: accessToken,

				r_refresh_token: refreshToken,
			};

			transaction && transaction.commit();

			return ctx.response.send({
				r_result: "success",

				...result,
			});
		} catch (err) {
			transaction && transaction.rollback();

			log.error(err);

			return ctx.response.send({
				r_result: "failed",

				r_error: err.message,

				...result,
			});
		}
	},
};
