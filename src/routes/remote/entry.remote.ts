import { getRequestEvent } from '$app/server';
import * as _ from 'radashi';

import { Authenticated } from '$utils/commanders';
import { prisma } from '$utils/prisma';
import utils from '$utils/general';

import schema from './entry.schema';

import type { Prisma } from '$utils/prisma';

export const getProjects = Authenticated.query(async ({ ctx }) => {
	const resp = await prisma.entry.findMany({
		where: {
			user: {
				equals: ctx
			},
			project: {
				not: null
			}
		},
		distinct: ['project'],
		select: {
			project: true
		}
	});
	return _.sift(resp.map((p) => p.project));
});

export const getEntries = Authenticated.query(async ({ ctx }) => {
	const event = getRequestEvent();
	const start = utils.getDate(event.url, 'start');
	const end = utils.getDate(event.url, 'end');
	const project = event.url.searchParams.get('project');

	const where: Prisma.EntryWhereInput = {
		user: {
			equals: ctx
		},
		date: {
			gte: start,
			lte: end
		}
	};
	if (project) {
		where.project = {
			equals: project
		};
	}
	return await prisma.entry.findMany({
		where,
		orderBy: {
			date: 'desc'
		}
	});
});

export const addEntry = Authenticated.form(schema.entry, async ({ ctx, data }) => {
	await prisma.entry.create({
		data: {
			user: ctx,
			...data
		}
	});
});

export const updateEntry = Authenticated.form(schema.updateEntry, async ({ ctx, data }) => {
	await prisma.entry.update({
		where: {
			user: ctx,
			id: data.id
		},
		data: data.data
	});
});

export const deleteEntry = Authenticated.form(schema.deleteEntry, async ({ ctx, data }) => {
	await prisma.entry.delete({
		where: {
			user: ctx,
			id: data.id
		}
	});
});
