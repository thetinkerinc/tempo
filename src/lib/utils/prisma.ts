import { withAccelerate } from '@prisma/extension-accelerate';
import { DATABASE_URL } from '$env/static/private';

import { PrismaClient } from '$prisma/client';

import type { PrismaClient as PrismaClientType } from '@prisma/client';

export type * from '$prisma/client';

let prisma: PrismaClientType;

function getPrisma() {
	if (prisma) {
		return prisma;
	}
	prisma = new PrismaClient({
		datasourceUrl: DATABASE_URL
	}).$extends(withAccelerate());
	return prisma;
}

export { getPrisma };
