import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { DATABASE_URL } from '$env/static/private';

import { PrismaClient } from '$prisma/client';

export type * from '$prisma/client';

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const adapter = new PrismaNeon({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
