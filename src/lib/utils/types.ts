import * as k from 'kysely';

import type { DB, EntryTable } from '@thetinkerinc/sprout/db';

export type Db = k.Kysely<DB>;
export type Tx = k.Transaction<DB>;
export type Entry = k.Selectable<EntryTable>;
