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
		// roles
		await knex.schema.createTable("t_roles", (t) => {
			t.increments("r_id");

			t.string("r_name", 50).notNullable();

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
			const roles = [
				{
					r_name: "user",
					// password = password
				},
				{
					r_name: "admin",
					// password = password
				},
			];

			for (const m of roles) {
				await knex
					.table("t_roles")

					.insert({
						...m,

						...times,
					})

					.then((r) => (m.id = r[0]));
			}
		}

		await knex.schema.createTable("t_permissions", (t) => {
			t.increments("r_id");

			t.string("r_name", 50).notNullable();

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
			const permissions = [
				{
					r_name: "GET /users",
					// password = password
				},
				{
					r_name: "POST /users",
					// password = password
				},
				{
					r_name: "PUT /users",
					// password = password
				},
				{
					r_name: "DELETE /users",
					// password = password
				},
			];

			for (const m of permissions) {
				await knex
					.table("t_permissions")

					.insert({
						...m,

						...times,
					})

					.then((r) => (m.id = r[0]));
			}
		}

		await knex.schema.createTable("t_roles_permissions", (t) => {
			t.increments("r_id");

			t.integer("r_role_id").notNullable();

			t.integer("r_permission_id").notNullable();

			t.datetime("r_created_at").notNullable().index();

			t.datetime("r_updated_at").nullable();

			t.datetime("r_deleted_at").nullable().index();

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
