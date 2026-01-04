import * as k from 'kysely';

declare module '@thetinkerinc/sprout/db' {
	interface DB {
		entries: EntryTable;
	}

	export interface EntryTable {
		id: k.Generated<string>;
		user: string;
		date: Date;
		hours: number;
		project: string | null;
	}
}
