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
	let transaction = undefined; // await knex.transaction();

	// main workflow
	try {
		// token
		const token = ctx.request.token;

		// params
		const params = ctx.request.params;

		// input
		let input = {
			// query
			...(ctx.request.query || {}),

			// body
			//...(ctx.request.body || {})
		};

		// validate url id
		Validator.validate(params, {
			id: {
				optional: true,
				type: ["string", "number"],
				regex: /^[1-9][0-9]*$/,
			},
		});

		//console.log(input.f_sort_by);

		// validate
		Validator.validate(input, {});

		// verify token
		//const tokenData = Jwt.verify(token, config.application.secret);
		const { payload, protectedHeader } = await Jose.jwtVerify(
			token,
			new TextEncoder().encode(config.application.secret)
		);

		// token error condition
		const tokenIsError = [
			payload.type !== "ACCESS_TOKEN",

			//tokenData.scopes.indexOf('GET /car-parks-summary') === -1
			// payload.permissions.indexOf("POST /roles_permissions") === -1,
		];

		// invalid token
		if (tokenIsError.indexOf(true) !== -1) {
			throw new Error("invalid token");
		}

		// let posts = await knex
		// 	.table("t_posts")
		// 	.select()
		// 	.where("r_ticket_id", params.id)
		// 	.whereNull("r_deleted_at");
		// let title = await knex
		// 	.table("t_posts as a")
		// 	.join("t_tickets as b", "b.r_id", "=", "a.r_ticket_id");

		let posts = await knex
			.table("t_posts as a")
			.join("t_users as b", "b.r_id", "=", "a.r_user_id")
			.join("t_tickets as c", "c.r_id", "=", "a.r_ticket_id")
			.select("r_name", "c.r_title", "r_content", "a.r_created_at")
			.where("r_ticket_id", params.id)
			.whereNull("a.r_deleted_at");

		// let posts = await knex
		// 	.table("t_posts as a")
		// 	.join("t_users as b", "b.r_id", "=", "a.r_user_id")
		// 	.select("r_name", "r_content", "a.r_created_at")
		// 	.where("r_ticket_id", params.id)
		// 	.whereNull("a.r_deleted_at");
		// add to result
		result = {
			...result,

			posts,
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
