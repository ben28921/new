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
			f_role_id: {
				optional: false,
				type: ["number", "string"],
			},
			f_permission_id: {
				optional: false,
				type: ["number", "string"],
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

			// payload.permissions.indexOf("POST /roles_permissions") === -1,
		];

		// invalid token
		if (tokenIsError.indexOf(true) !== -1) {
			throw new Error("invalid token");
		}

		// const roleNameCount = await knex
		// 	.table("t_roles")
		// 	.where("r_id", input.f_role_id)
		// 	.count("r_id", { as: "r_total" })
		// 	.then((r) => r[0].r_total);
		// if (roleNameCount > 0) {
		// 	throw new Error("Role exist");
		// }

		const roles_permissions = await knex
			.table("t_roles_permissions")
			.where("r_role_id", input.f_role_id)
			.where("r_permission_id", input.f_permission_id)
			.first();
		if (typeof roles_permissions !== "undefined") {
			throw new Error("Role - Permission exist");
		}

		const roles = await knex
			.table("t_roles")
			.where("r_id", input.f_role_id)
			.first();

		if (typeof roles === "undefined") {
			throw new Error("Role do not exist");
		}

		const permissions = await knex
			.table("t_permissions")
			.where("r_id", input.f_permission_id)
			.first();

		if (typeof permissions === "undefined") {
			throw new Error(" Permissions do not exist");
		}

		console.log(roles);
		await transaction.table("t_roles_permissions").insert({
			r_role_id: input.f_role_id,
			r_permission_id: input.f_permission_id,
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
