import { getRequestEvent } from '$app/server';
import * as _ from 'radashi';

import { protectedQuery, protectedForm } from '$utils/auth';
import { prisma } from '$utils/prisma';
import utils from '$utils/general';

import schema from './entry.schema';

import type { Prisma } from '$utils/prisma';

export const getProjects = protectedQuery(async ({ userId }) => {
	const resp = await prisma.entry.findMany({
		where: {
			user: {
				equals: userId
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

export const getEntries = protectedQuery(async ({ userId }) => {
	const event = getRequestEvent();
	const start = utils.getDate(event.url, 'start');
	const end = utils.getDate(event.url, 'end');
	const project = event.url.searchParams.get('project');

	const where: Prisma.EntryWhereInput = {
		user: {
			equals: userId
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

export const addEntry = protectedForm(schema.entry, async ({ userId, data }) => {
	await prisma.entry.create({
		data: {
			user: userId,
			...data
		}
	});
});

export const updateEntry = protectedForm(schema.updateEntry, async ({ userId, data }) => {
	await prisma.entry.update({
		where: {
			user: userId,
			id: data.id
		},
		data: data.data
	});
});

export const deleteEntry = protectedForm(schema.deleteEntry, async ({ userId, data }) => {
	await prisma.entry.delete({
		where: {
			user: userId,
			id: data.id
		}
	});
});
