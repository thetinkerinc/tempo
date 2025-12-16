import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('entries')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
		.addColumn('user', 'text', (col) => col.notNull())
		.addColumn('date', 'timestamp', (col) => col.notNull())
		.addColumn('hours', 'numeric', (col) => col.notNull())
		.addColumn('project', 'text')
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('entries').execute();
}
