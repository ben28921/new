'use strict';

const Path = require('path');

const Async = require('async');

const Fs = require('fs');

module.exports.doUpdate = async ctx => {

	// bunyan
	let log = ctx.log;

	// knex
	let knex = ctx.knex;

	// do logic
	try {

		// default batch
		var batch = 1;

		// check has migrations table
		var hasMigrationsTable = await knex.schema.hasTable('t_db_migrations');

		// create migrations table 
		if (!hasMigrationsTable) {

			await knex.schema

				.createTable('t_db_migrations', function (table) {

					table.increments('r_id');

					table.string('r_name', 255).nullable().unique();

					table.integer('r_batch').nullable().index();

					table.datetime('r_created_at').nullable().index();

					table.engine('innodb');

					table.charset('utf8mb4');

					table.collate('utf8mb4_general_ci');
				});
		}

		// get current batch number
		else {

			// get migrations
			var res = await knex('t_db_migrations').max('r_batch', {

				as: 'max'
			});

			batch = res[0].max === null ? batch : (res[0].max + 1);
		}

		// get migration files
		var files = Fs.readdirSync(Path.join(__dirname, 'migration'));

		files = files.filter(file => /^[^\.]+\.js$/.test(file));

		for (var i in files) {

			var file = files[i];

			var migration = await knex('t_db_migrations').where('r_name', file).first();

			if (typeof migration !== 'undefined') {

				continue;
			}

			// include update file
			var updateFile = require(Path.join(__dirname, 'migration', file));

			// check has update function
			if (typeof updateFile.update === 'function') {

				// record job
				await knex('t_db_migrations').insert({

					r_name: file,

					r_batch: batch,

					r_created_at: new Date()
				});

				// log
				log.info('Update database: ' + file);

				// do module update
				await updateFile.update(ctx);
			}
		}

	} catch (err) {

		// throw error
		throw err;
	}
};