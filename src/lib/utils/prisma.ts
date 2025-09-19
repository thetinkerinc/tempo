import { DATABASE_URL } from '$env/static/private';

import { PrismaClient } from '$prisma/client';

export type * from '$prisma/client';

function getPrisma() {
	return new PrismaClient({
		datasourceUrl: DATABASE_URL
	});
}

export { getPrisma };
