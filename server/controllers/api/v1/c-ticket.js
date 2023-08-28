"use strict";

const Path = require("path");

const Async = require("async");

const Fs = require("fs");

const Axios = require("axios");

const Moment = require("moment");

const Crypto = require("crypto");

const Jose = require("jose");

const Validator = require("19json-validator");

module.exports = async (ctx) => {
	let result = {};

	let config = ctx.config;

	let log = ctx.log;

	let knex = ctx.knex;

	let transaction = await knex.transaction();
	try {
		//token
		const token = ctx.request.token;
		// console.log("ctx", ctx.request.token);

		const params = ctx.request.params;

		let input = {
			...(ctx.request.body || {}),
		};

		Validator.validate(params, {
			id: {
				optional: true,
				type: ["string", "number"],
				regex: /^[1-9][0-9]*$/,
			},
		});

		Validator.validate(input, {
			// f_staff_no: { optional: params.hasOwnProperty("id"), empty: false, type: 'string' },
			f_test: {
				optional: true,
				type: ["string", "number"],
				regex: /^[0-9]*$/,
			},
			f_test2: {
				optional: true,
				type: ["string", "number"],
				regex: /^[0-9]*$/,
			},
		});

		const { payload, protectedHeader } = await Jose.jwtVerify(
			token,
			new TextEncoder().encode(config.application.secret)
		);

		const tokenIsError = [payload.type !== "ACCESS_TOKEN"];

		if (tokenIsError.indexOf(true) !== -1) {
			throw new Error("invalid token");
		}

		// const sqlParams = {
		// 	r_updated_at: new Date(),

		// 	r_modified_by: payload.id,
		// };

		const tableName = "t_test";

		let modelId = undefined;

		// if(params.hasOwnProperty('id')){

		// }

		await transaction.table("t_test").insert({
			r_test: input.f_test,
			r_test2: input.f_test2,
			r_test3: input.f_test3,
			r_test4: input.f_test4,
		});

		result = {
			...result,
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
};
