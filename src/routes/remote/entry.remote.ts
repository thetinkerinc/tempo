import { getRequestEvent } from '$app/server';
import * as _ from 'radashi';

import { Authenticated } from '$utils/commanders';
import { db } from '$utils/db';
import utils from '$utils/general';

import schema from './entry.schema';

export const getProjects = Authenticated.query(async ({ ctx }) => {
	const resp = await db
		.selectFrom('entries')
		.where('user', '=', ctx)
		.where('project', 'is not', null)
		.select(['project'])
		.distinct()
		.execute();
	return _.unique(_.sift(resp.map((p) => p.project)));
});

export const getEntries = Authenticated.query(async ({ ctx }) => {
	const event = getRequestEvent();
	const start = utils.getDate(event.url, 'start');
	const end = utils.getDate(event.url, 'end');
	const project = event.url.searchParams.get('project');

	return await db
		.selectFrom('entries')
		.selectAll()
		.where('user', '=', ctx)
		.where('date', '>=', start)
		.where('date', '<=', end)
		.$if(project != null, (q) => q.where('project', '=', project))
		.orderBy('date', 'desc')
		.execute();
});

export const addEntry = Authenticated.form(schema.entry, async ({ ctx, data }) => {
	await db
		.insertInto('entries')
		.values({
			...data,
			user: ctx
		})
		.execute();
});

export const updateEntry = Authenticated.form(schema.updateEntry, async ({ ctx, data }) => {
	await db
		.updateTable('entries')
		.set({
			...data.data
		})
		.where('id', '=', data.id)
		.where('user', '=', ctx)
		.execute();
});

export const deleteEntry = Authenticated.form(schema.deleteEntry, async ({ ctx, data }) => {
	await db.deleteFrom('entries').where('id', '=', data.id).where('user', '=', ctx).execute();
});
