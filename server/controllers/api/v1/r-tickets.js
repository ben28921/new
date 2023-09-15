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

		// knex.table(t_tickets).where();
		//check param id
		console.log(payload.id);
		let tickets;
		// if (payload.role === 1) {
		// 	if (params.hasOwnProperty("id")) {
		// 		tickets = await knex
		// 			.table("t_tickets")
		// 			.select("r_id", "r_title", "r_created_at")
		// 			.where("r_user_id", payload.id)
		// 			.where("r_id", params.id)
		// 			.whereNull("r_deleted_at")
		// 			.first();
		// 		if (typeof tickets === "undefined") {
		// 			throw new Error("TICKET ID Not Exist");
		// 		}
		// 	}
		// }
		if (payload.role === 1) {
			tickets = await knex
				.table("t_tickets")
				.select("r_id", "r_title", "r_created_at")
				.where("r_user_id", payload.id)
				.whereNull("r_deleted_at");
			// .first();
			if (typeof tickets === "undefined") {
				throw new Error("TICKET ID Not Exist");
			}
		}
		if (payload.role === 2) {
			// tickets = await knex
			// .table("t_tickets")
			// .join("t_users", "t_users.r_id", "=", "t_tickets.r_user_id")
			// .select("r_id", "r_title", "r_user_id", "r_created_at")
			// .whereNull("r_deleted_at");

			// tickets = await knex
			// 	.table("t_tickets")
			// 	.select("r_id", "r_title", "r_user_id", "r_created_at")
			// 	.whereNull("r_deleted_at");

			tickets = await knex
				.table("t_tickets as a ")
				.join("t_users as b ", "b.r_id", "=", "a.r_user_id")
				.select("a.r_id", "r_title", "r_user_id", "r_name", "a.r_created_at")
				.orderBy("a.r_created_at", "desc")
				.whereNull("a.r_deleted_at");
		}

		// "r_id": 1,
		// "r_username": "ben",
		// "r_password": "bd255b71f740860db5c5f23ac3d5ede16d81303dd588657a0d0914d9563d0cbb39abeae3ddff9cbf310188d0e4282ae400d21fb61575b5a9b321f984b0235ce1",
		// "r_created_at": "2023-08-28T09:12:29.000Z",
		// "r_updated_at": null,
		// "r_deleted_at": null
		// add to result
		result = {
			...result,

			tickets,
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
