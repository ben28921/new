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
const { SlowBuffer } = require("buffer");

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
		];

		// invalid token
		if (tokenIsError.indexOf(true) !== -1) {
			throw new Error("invalid token");
		}
		// let users;
		// if (params.hasOwnProperty("id")) {
		// 	users = await knex
		// 		.table("t_users")
		// 		.select("r_id", "r_username", "r_created_at")
		// 		.where("r_id", params.id)
		// 		.whereNull("r_deleted_at")
		// 		.first();
		// 	if (typeof users === "undefined") {
		// 		throw new Error("User ID Not Exist");
		// 	}
		// } else {
		// 	users = await knex
		// 		.table("t_users")
		// 		.select("r_id", "r_username", "r_created_at")
		// 		.whereNull("r_deleted_at");
		// }

		let permissions = await knex
			.table("t_roles")
			.join(
				"t_roles_permissions",
				"t_roles.r_id",
				"=",
				"t_roles_permissions.r_role_id"
			)
			.join(
				"t_permissions",
				"t_permissions.r_id",
				"=",
				"t_roles_permissions.r_permission_id"
			)
			.select("t_roles.r_name as role  ", "t_permissions.r_name as permission");

		// console.log(typeof permissions);
		// console.log(permissions);
		// permissions.forEach((element) => {
		// 	console.log("1", element);
		// 	console.log(element.role);
		// 	console.log(element.permission);
		// });
		let adminPerSet = [];
		let userPerSet = [];
		let adminPermission = new Object();
		let userPermission = new Object();
		permissions.forEach((a) => {
			if (a.role === "admin") {
				// perSet = [{ permissions: [...new Set([].concat(a.permission))] }];
				adminPerSet.push(a.permission);
				adminPermission.role = "admin";
			} else if (a.role === "user") {
				userPerSet.push(a.permission);
				userPermission.role = "user";
			}
		});

		if (adminPermission.role === "admin") {
			// perSet = [{ permissions: [...new Set([].concat(a.permission))] }];
			adminPermission.permission = adminPerSet;
		}

		if (userPermission.role === "user") {
			userPermission.permission = userPerSet;
		}

		result = {
			...result,
			adminPermission,
			userPermission,
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
