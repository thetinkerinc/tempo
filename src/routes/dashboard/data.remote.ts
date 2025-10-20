import * as _ from 'radashi';

import { protectedQuery, protectedForm } from '$utils/auth';
import { prisma } from '$utils/prisma';

import schema from './schema';

import type { Prisma } from '$utils/prisma';

export const getProjects = protectedQuery(async () => {
	const resp = await prisma.entry.findMany({
		where: {
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

export const getEntries = protectedQuery(schema.getEntries, async ({ userId, params }) => {
	const where: Prisma.EntryWhereInput = {
		user: {
			equals: userId
		},
		date: {
			gte: params.start,
			lte: params.end
		}
	};
	if (params.project) {
		where.project = {
			equals: params.project
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

export const updateEntry = protectedForm(schema.updateEntry, async ({ data }) => {
	await prisma.entry.update({
		where: {
			id: data.id
		},
		data: data.data
	});
});
