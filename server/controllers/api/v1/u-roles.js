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

	// bunya
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
			...(ctx.request.query || {}),

			// body
			...(ctx.request.body || {}),
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
		Validator.validate(input, {
			f_name: {
				optional: true,
				type: ["string", "number"],
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

			//tokenData.scopes.indexOf('GET /car-parks-summary') === -1
			// payload.permissions.indexOf("POST /roles_permissions") === -1,
		];

		// invalid token
		if (tokenIsError.indexOf(true) !== -1) {
			throw new Error("invalid token");
		}

		const datas = { r_updated_at: new Date() };

		const role_with_id = await knex
			.table("t_roles")
			.where("r_id", params.id)
			.whereNull("r_deleted_at")
			.first();
		if (typeof role_with_id === "undefined") {
			throw new Error("ROLE ID Not Exist");
		}

		if (input.hasOwnProperty("f_name")) {
			const roleNameCount = await knex
				.table("t_roles")
				.where("r_name", input.f_name)
				.whereNot("r_id", params.id)
				.count("r_id", { as: "r_total" })
				.then((r) => r[0].r_total);
			if (roleNameCount > 0) {
				throw new Error("Name exist");
			}
			datas.r_name = input.f_name;
		}
		await transaction.table("t_roles").where("r_id", params.id).update(datas);

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
