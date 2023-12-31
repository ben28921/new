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

module.exports = async (ctx) => {
	// result object
	let result = {};

	// config
	let config = ctx.config;

	// bunyan
	let log = ctx.log;

	// knex
	let knex = ctx.knex;

	// knex transaction
	// let transaction = undefined; // await knex.transaction();

	let transaction = await knex.transaction();
	// main workflow
	try {
		// token
		const token = ctx.request.token;

		// params
		const params = ctx.request.params;

		// input
		let input = {
			// query
			// ...(ctx.request.query || {}),

			// body
			...(ctx.request.body || {}),
		};

		// validate url id
		Validator.validate(params, {});

		//console.log(input.f_sort_by);

		// validate
		Validator.validate(input, {
			username: {
				optional: false,
				type: ["string", "number"],
			},
			password: {
				optional: false,
				type: ["string", "number"],
				regex: /^[0-9]*$/,
			},
		});

		// verify token
		//const tokenData = Jwt.verify(token, config.application.secret);
		const { payload, protectedHeader } = await Jose.jwtVerify(
			token,
			new TextEncoder().encode(config.application.secret)
		);

		// token error condition
		const tokenIsError = [
			payload.type !== "ACCESS_TOKEN",

			// payload.permissions.indexOf("POST /users") === -1,
		];

		// invalid token
		if (tokenIsError.indexOf(true) !== -1) {
			throw new Error("invalid token");
		}

		const userNameCount = await knex
			.table("t_users")
			.where("r_name", input.username)
			.count("r_id", { as: "r_total" })
			.then((r) => r[0].r_total);
		console.log(userNameCount);
		if (userNameCount > 0) {
			throw new Error("Username exist");
		}

		const password = Crypto.createHmac("sha512", config.application.secret)
			.update(input.password)
			.digest("hex");

		await transaction.table("t_users").insert({
			r_name: input.username,
			r_password: password,
			r_role_id: 1,
			r_created_at: new Date(),
		});

		// add to result
		result = {
			...result,
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
};
