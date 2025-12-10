import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { defineRelations } from 'drizzle-orm';
import * as pg from 'drizzle-orm/pg-core';
import { dev } from '$app/environment';
import { DATABASE_URL } from '$env/static/private';

export * from 'drizzle-orm';

// Schema definition
export const entries = pg.pgTable(
	'entries',
	{
		id: pg.uuid().primaryKey().defaultRandom().notNull(),
		user: pg.text().notNull(),
		date: pg.timestamp({ mode: 'date', withTimezone: false }).notNull(),
		hours: pg.numeric({ mode: 'number' }).notNull(),
		project: pg.text()
	},
	(table) => [pg.index('entry_users').on(table.user)]
);

export const schema = {
	entries
};

// Relation definitions
const relations = defineRelations({ entries }, () => ({
	entries: {}
}));

// Initialize db client
export const db = await initDb(relations);

// Type definitions
export type Entry = typeof entries.$inferSelect;

async function initDb(relations: ReturnType<typeof defineRelations>) {
	let client;
	if (dev) {
		const drizzlePGlite = await import('drizzle-orm/pglite');
		const { PGlite } = await import('@electric-sql/pglite');
		client = new PGlite('./data/db');
		return drizzlePGlite.drizzle({ client, relations });
	}
	else {
		client = neon(DATABASE_URL);
		return drizzle({ client, relations });
	}
}
