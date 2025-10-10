import { error } from '@sveltejs/kit';
import { query, command, getRequestEvent } from '$app/server';
import * as _ from 'radashi';

import { prisma } from '$utils/prisma';

import schema from './schema';

import type { Prisma } from '$utils/prisma';

export const getProjects = query(async () => {
	protect();
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

export const getEntries = query(schema.getEntries, async (params) => {
	const userId = protect();

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

export const addEntry = command(schema.entry, async (data) => {
	const userId = protect();
	await prisma.entry.create({
		data: {
			user: userId,
			...data
		}
	});
});

export const updateEntry = command(schema.updateEntry, async (data) => {
	protect();
	await prisma.entry.update({
		where: {
			id: data.id
		},
		data: data.data
	});
});

function protect(): string {
	const event = getRequestEvent();
	const { userId } = event.locals.auth();
	if (!userId) {
		error(403, "You don't have permission to perform this action");
	}
	return userId;
}
