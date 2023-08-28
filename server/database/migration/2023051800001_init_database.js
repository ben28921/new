"use strict";

const Path = require("path");

const Async = require("async");

const Crypto = require("crypto");

module.exports.update = async (ctx) => {
	// knex
	const knex = ctx.knex;

	// config
	const config = ctx.config;

	// timestamp
	const times = {
		r_created_at: new Date(),
	};

	// start transaction
	let transaction = undefined; // await knex.transaction();

	// main workflow
	try {
		// admin
		await knex.schema.createTable("t_users", (t) => {
			t.increments("r_id");

			t.string("r_username", 50).notNullable();

			t.string("r_password", 255).notNullable();

			t.integer("r_role_id").notNullable();

			t.datetime("r_created_at").notNullable().index();

			t.datetime("r_updated_at").nullable();

			t.datetime("r_deleted_at").nullable().index();

			t.engine("innodb");

			t.charset("utf8mb4");

			t.collate("utf8mb4_general_ci");
		});

		{
			// seed

			// admin data
			const users = [
				{
					r_username: "ben",

					// password = password
					r_password:
						"bd255b71f740860db5c5f23ac3d5ede16d81303dd588657a0d0914d9563d0cbb39abeae3ddff9cbf310188d0e4282ae400d21fb61575b5a9b321f984b0235ce1",

					r_role_id: 1,
				},
			];

			for (const m of users) {
				await knex
					.table("t_users")

					.insert({
						...m,

						...times,
					})

					.then((r) => (m.id = r[0]));
			}
		}

		// commit
		transaction && transaction.commit();
	} catch (err) {
		// error
		// rollback
		transaction && transaction.rollback();

		// throw error
		throw err;
	}
};
