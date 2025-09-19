import dayjs from 'dayjs';

import { getPrisma } from '$utils/prisma';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { userId } = event.locals.auth();
	if (!userId) {
		return;
	}
	const prisma = getPrisma();
	const start = getDate(event.url, 'start');
	const end = getDate(event.url, 'end');
	const projects = await prisma.entry.findMany({
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
	const entries = await prisma.entry.findMany({
		where: {
			user: {
				equals: userId
			},
			date: {
				gte: start,
				lte: end
			}
		},
		orderBy: {
			date: 'desc'
		}
	});
	return {
		projects: projects.map((p) => p.project),
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
