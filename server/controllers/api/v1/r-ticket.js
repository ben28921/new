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

	let transaction = undefined;

	try {
		const token = ctx.request.token;

		const params = ctx.request.params;

		let input = {
			...(ctx.request.query || {}),
		};

		Validator.validate(params, {
			id: {
				optional: true,
				type: ["string", "number"],
				regex: /^[1-9][0-9]*$/,
			},
		});

		Validator.validate(input, {
			f_search: { optional: true, type: "string", empty: false },

			f_limit: {
				optional: true,
				type: ["string", "number"],
				regex: /^[1-9][0-9]*$/,
			},

			f_offset: {
				optional: true,
				type: ["string", "number"],
				regex: /^[0-9]+$/,
			},

			// f_sort_by :{optional:true,type:'string',empty:false},
		});

		const { payload, protectedHeader } = await Jose.jwtVerify(
			token,
			new TextEncoder().encode(config.application.secret)
		);

		const tokenIsError = [payload.type !== "ACCESS_TOKEN"];

		if (tokenIsError.indexOf(true) !== -1) {
			throw new Error("invalid token");
		}
		const ticket = await knex.table("t_test").select("*");
		// const model = ticket
		// 	.clone()
		// 	.select("r_test")
		// 	.then((m) => {
		// 		console.log(m);
		// 		// m.forEach((m) => {
		// 		// 	r_;
		// 		// });
		// 		return m;
		// 	});
		console.log(ticket);
		result = {
			...result,
			ticket,
			// r_data: !params.hasOwnProperty("id") ? models : models[0],
			// r_total: !params.hasOwnProperty("id") ? total : undefined,
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
