import { getRequestEvent } from '$app/server';
import * as _ from 'radashi';

import { Authenticated } from '$utils/commanders';
import { db, schema as dbSchema, eq, and } from '$utils/drizzle';
import utils from '$utils/general';

import fnSchema from './entry.schema';

export const getProjects = Authenticated.query(async ({ ctx }) => {
	const resp = await db.query.entries.findMany({
		where: {
			user: ctx,
			project: {
				isNotNull: true
			}
		},
		columns: {
			project: true
		}
	});
	return _.unique(_.sift(resp.map((p) => p.project)));
});

export const getEntries = Authenticated.query(async ({ ctx }) => {
	const event = getRequestEvent();
	const start = utils.getDate(event.url, 'start');
	const end = utils.getDate(event.url, 'end');
	const project = event.url.searchParams.get('project');

	type EntryWhere = WhereOf<typeof db.query.entries.findMany>;

	const where: EntryWhere = {
		user: ctx,
		date: {
			gte: start,
			lte: end
		}
	};
	if (project) {
		where.project = project;
	}

	return await db.query.entries.findMany({
		where,
		orderBy: {
			date: 'desc'
		}
	});
});

export const addEntry = Authenticated.form(fnSchema.entry, async ({ ctx, data }) => {
	await db.insert(dbSchema.entries).values({
		...data,
		user: ctx
	});
});

export const updateEntry = Authenticated.form(fnSchema.updateEntry, async ({ ctx, data }) => {
	await db
		.update(dbSchema.entries)
		.set({
			...data.data
		})
		.where(and(eq(dbSchema.entries.user, ctx), eq(dbSchema.entries.id, data.id)));
});

export const deleteEntry = Authenticated.form(fnSchema.deleteEntry, async ({ ctx, data }) => {
	await db
		.delete(dbSchema.entries)
		.where(and(eq(dbSchema.entries.user, ctx), eq(dbSchema.entries.id, data.id)));
});
