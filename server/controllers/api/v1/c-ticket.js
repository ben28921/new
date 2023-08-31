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
			// id: {
			// 	optional: true,
			// 	type: ["string", "number"],
			// 	regex: /^[1-9][0-9]*$/,
			// },
		});

		Validator.validate(input, {
			// f_staff_no: { optional: params.hasOwnProperty("id"), empty: false, type: 'string' },
			f_title: {
				optional: false,
				type: ["string"],
			},
			f_msg: {
				optional: false,
				type: ["string"],
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

		// if(params.hasOwnProperty('id')){

		// }

		await transaction.table("t_ticket").insert({
			r_title: input.f_title,
			r_user: payload.name,
			r_msg: input.f_msg,
			r_created_at: new Date(),
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
