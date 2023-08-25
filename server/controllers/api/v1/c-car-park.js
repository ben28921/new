'use strict';

const Path = require('path');

const Async = require('async');

const Fs = require('fs');

const Axios = require('axios');

const Moment = require('moment');

const Crypto = require('crypto');

//const Jwt = require('jsonwebtoken');
const Jose = require('jose')

const Validator = require('19json-validator');

module.exports = async ctx => {

	// result object
	let result = {};

	// config
	let config = ctx.config;

	// bunyan
	let log = ctx.log;

	// knex
	let knex = ctx.knex;

	// knex transaction
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
			...(ctx.request.body || {})
		};

		// validate url id
		Validator.validate(params, {

			id: { type: ['string', 'number'], regex: /^[1-9][0-9]*$/ }
		});

		// validate
		Validator.validate(input, {

			//f_name: { type: 'string', empty: false },

			f_address: { type: 'string', empty: false }
		});

		// verify token
		//const tokenData = Jwt.verify(token, config.application.secret);
		const { payload, protectedHeader } = await Jose.jwtVerify(token, new TextEncoder().encode(config.application.secret));

		// token error condition
		const tokenIsError = [

			payload.type !== 'ACCESS_TOKEN',

			//tokenData.scopes.indexOf('GET /car-parks-summary') === -1
		];

		// invalid token
		if (tokenIsError.indexOf(true) !== -1) {

			throw new Error('invalid token');
		}

		// create
		await transaction.table('t_car_parks')
			.where('r_id', params.id)
			.update({
				//r_name: input.f_name,
				r_address: input.f_address,
				r_updated_at: new Date(),
				r_modified_by: payload.id // token payload
			})

		// add to result
		result = {

			...result
		};

		// commit
		transaction && transaction.commit();

		// send response
		return ctx.response.send({

			r_result: "success",

			...result
		});
	}

	// error
	catch (err) {

		// rollback
		transaction && transaction.rollback();

		// log
		log.error(err);

		// send response
		return ctx.response.send({

			r_result: "failed",

			r_error: err.message,

			...result
		});
	}
};