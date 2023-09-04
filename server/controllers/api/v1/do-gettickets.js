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

		const tickets = await knex.table("t_tickets").select("r_id", "r_title");

		const ticketIds = tickets.map((el) => el.r_id);

		const posts = await knex
			.table("t_posts")
			.select("r_id", "r_content", "r_ticket_id")
			.whereIn("r_ticket_id", ticketIds);

		console.log(posts);
		tickets.forEach((element) => {
			const { r_id, r_title } = element;
			element.posts = posts.filter((ele) => ele.r_ticket_id == r_id);
		});
		// const ticketGroup = posts.groupBy("r_ticket_id");
		// console.log(ticketGroup);

		// console.log(tickets);
		// console.log(ticketIds);
		console.log(posts);
		// add to result
		result = {
			...result,
			data: tickets,
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
