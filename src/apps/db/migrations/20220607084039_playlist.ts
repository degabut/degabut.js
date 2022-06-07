import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("playlist", (table) => {
		table.string("id").primary();
		table.string("name");
		table.string("owner_id");
		table.timestamp("created_at");
		table.timestamp("updated_at");
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists("playlist");
}
