import dayjs from 'dayjs';

import { getPrisma } from '$utils/prisma';

import type { Prisma, PrismaClient } from '$utils/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { userId } = event.locals.auth();
	if (!userId) {
		return;
	}

	const prisma = getPrisma();
	const start = getDate(event.url, 'start');
	const end = getDate(event.url, 'end');
	const project = event.url.searchParams.get('project');

	const projects = await getProjects(prisma);
	const entries = await getEntries(prisma, userId, start, end, project);

	return {
		projects,
		entries
	};
};

function getDate(url: URL, name: 'start' | 'end'): Date {
	const dateString = url.searchParams.get(name);
	if (dateString) {
		return new Date(dateString);
	}
	return {
		start: dayjs().subtract(1, 'month').startOf('month').toDate(),
		end: dayjs().subtract(1, 'month').endOf('month').toDate()
	}[name];
}

async function getProjects(prisma: PrismaClient) {
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
	return resp.map((p) => p.project);
}

async function getEntries(
	prisma: PrismaClient,
	userId: string,
	start: Date,
	end: Date,
	project: string | null
) {
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
}
