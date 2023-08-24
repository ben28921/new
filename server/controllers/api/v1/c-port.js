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

    try{
        //token
        const token = ctx.requst.token;

        const params = ctx.requst.params;

        let input ={

            ...(ctx.requst.body||{})

        };

        Validator.validate(params,{
            id: { optional: true, type: ['string', 'number'], regex: /^[1-9][0-9]*$/ }
        })


        Validator.validate(input, {

			f_staff_no: { optional: params.hasOwnProperty("id"), empty: false, ttype: 'string' },

			f_name: { optional: false, empty: false, type: 'string' },

			f_email: { optional: false, type: 'string' },

			f_manager_name: { optional: true, type: 'string' },

			f_manager_email: { optional: true, type: 'string' },

			f_remarks: { optional: true, type: 'string' },

			f_parking_space_type_ids: { optional: false, isArray: true, childrenSchema: { direct: true, type: ['string', 'number'], regex: /^[1-9][0-9]*$/ } },

			f_car_park_ids: { optional: false, isArray: true, childrenSchema: { direct: true, type: ['string', 'number'], regex: /^[1-9][0-9]*$/ } },

			f_cars: {

				optional: false, isArray: true, childrenSchema: {

					f_reg_mark: { optional: false, type: 'string', empty: false },

					f_color: { optional: false, type: 'string' },

					f_brand: { optional: false, type: 'string' }
				}
			},

			f_resigned: { optional: false, type: ['string', 'number'], regex: /^[0|1]$/ },
		});

        const {payload,protectedHeader} = await Jose.jwtVerify(token,new TextEncoder().encode(config.application.secret));

        const tokenIsError = [ payload.type !== 'ACCESS_TOKEN',]

        if(tokenIsError.indexOf(true) !== -1){
            throw new Error('invalid token');
        }

        const sqlParams = {
            r_updated_at:new Date(),

            r_modified_by:payload.id
        };

        const tableName = 't_staff'

        let modelId = undefined;


        
        // if(params.hasOwnProperty('id')){

        // }
    }
};
