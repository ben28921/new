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

	console.log("user", user);

	const roles_permissions = await knex
		.table("t_roles_permissions")
		.where("r_role_id", user.r_role_id);
	// console.log(roles_permissions);

	const permissions = await knex.table("t_permissions").whereIn(
		"r_id",
		roles_permissions.map((obj) => obj.r_permission_id)
	);

	// console.log(permissions);

	// let permission = [];

	// permission = [...new Set(permission)];

	console.log("userid", user.r_role_id);
	const accessToken = await new Jose.SignJWT({
		id: user.r_id,

		username: user.r_name,

		role: user.r_role_id,

		type: "ACCESS_TOKEN",

		name: user.r_name,

		email: user.r_email,

		permissions: permissions.map((obj) => obj.r_name),

		exp: Math.floor(Date.now() / 1000) + accessTokenExpireSeconds,
	})
		.setProtectedHeader({ alg: "HS256" })
		.sign(new TextEncoder().encode(config.application.secret));

	const refreshToken = await new Jose.SignJWT({
		id: user.r_id,

		username: user.r_name,

		role: user.r_role_id,

		type: "REFRESH_TOKEN",

		name: user.r_name,

		email: user.r_email,

		permissions: permissions.map((obj) => obj.r_name),

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
