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
		// user
		await knex.schema.createTable("t_users", (t) => {
			t.increments("r_id");

			t.string("r_name", 50).notNullable();

			t.string("r_password", 255).notNullable();

			t.integer("r_role_id").notNullable();

			t.datetime("r_created_at").notNullable().index();

			t.datetime("r_updated_at").nullable();

			t.datetime("r_deleted_at").nullable().index();

			t.engine("innodb");

			t.charset("utf8mb4");

			t.collate("utf8mb4_general_ci");
		});

		// t_tickets
		await knex.schema.createTable("t_tickets", (t) => {
			t.increments("r_id").notNullable();

			t.integer("r_user_id", 50).notNullable();

			t.string("r_title", 50).notNullable();

			t.tinyint("r_is_solved").notNullable();

			t.datetime("r_created_at").notNullable().index();

			t.datetime("r_updated_at").nullable();

			t.datetime("r_deleted_at").nullable().index();

			t.integer("r_modified_by").nullable();

			t.engine("innodb");

			t.charset("utf8mb4");

			t.collate("utf8mb4_general_ci");
		});
		{
			// seed

			// admin data
			const users = [
				{
					r_name: "ben",

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

		// t_posts
		await knex.schema.createTable("t_posts", (t) => {
			t.increments("r_id").notNullable();

			t.integer("r_ticket_id").notNullable();

			t.integer("r_user_id").notNullable();

			t.string("r_content", 255).nullable();

			t.datetime("r_created_at").notNullable().index();

			t.datetime("r_updated_at").nullable();

			t.datetime("r_deleted_at").nullable().index();

			t.integer("r_modified_by").nullable();

			t.engine("innodb");

			t.charset("utf8mb4");

			t.collate("utf8mb4_general_ci");
		});

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
