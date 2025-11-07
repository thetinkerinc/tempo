import * as v from 'valibot';

import * as m from '$paraglide/messages';

const entry = v.object({
	date: v.pipe(v.string(), v.isoTimestamp()),
	hours: v.pipe(v.number(), v.gtValue(0, m.schema_hours())),
	project: v.optional(
		v.pipe(
			v.string(),
			v.transform((s) => (s === '' ? null : s))
		)
	)
});

const updateEntry = v.object({
	id: v.string(),
	data: entry
});

const deleteEntry = v.object({
	id: v.string()
});

export default {
	entry,
	updateEntry,
	deleteEntry
};
