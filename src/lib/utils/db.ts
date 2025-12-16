import * as k from 'kysely';
import { NeonDialect } from 'kysely-neon';
import { neon, types } from '@neondatabase/serverless';
import { dev } from '$app/environment';
import { DATABASE_URL } from '$env/static/private';

interface DB {
	entries: EntryTable;
}

interface EntryTable {
	id: k.Generated<string>;
	user: string;
	date: Date;
	hours: number;
	project: string | null;
}

export type Entry = k.Selectable<EntryTable>;

export const db = await initDb();

async function initDb() {
	if (dev) {
		const { KyselyPGlite } = await import('kysely-pglite');
		const { types } = await import('@electric-sql/pglite');
		const { dialect } = await KyselyPGlite.create('./data/db/', {
			parsers: {
				[types.NUMERIC]: (v) => Number(v)
			}
		});
		return new k.Kysely<DB>({
			dialect
		});
	} else {
		types.setTypeParser(types.builtins.NUMERIC, (v) => Number(v));
		return new k.Kysely<DB>({
			dialect: new NeonDialect({
				neon: neon(DATABASE_URL)
			})
		});
	}
}
