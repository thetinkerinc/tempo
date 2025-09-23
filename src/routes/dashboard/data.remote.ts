import { error } from '@sveltejs/kit';
import { command, getRequestEvent } from '$app/server';
import * as v from 'valibot';

import { getPrisma } from '$utils/prisma';

import * as m from '$paraglide/messages';

const entrySchema = v.object({
	date: v.pipe(v.string(), v.isoTimestamp()),
	hours: v.pipe(v.number(), v.minValue(1, m.schema_hours())),
	project: v.optional(
		v.pipe(
			v.string(),
			v.transform((s) => (s === '' ? null : s))
		)
	)
});

export const addEntry = command(entrySchema, async (data) => {
	const userId = protect();
	const prisma = getPrisma();
	await prisma.entry.create({
		data: {
			user: userId,
			...data
		}
	});
});

export const updateEntry = command(
	v.object({
		id: v.string(),
		data: entrySchema
	}),
	async (data) => {
		protect();
		const prisma = getPrisma();
		await prisma.entry.update({
			where: {
				id: data.id
			},
			data: data.data
		});
	}
);

function protect(): string {
	const event = getRequestEvent();
	const { userId } = event.locals.auth();
	if (!userId) {
		error(403, "You don't have permission to perform this action");
	}
	return userId;
}
