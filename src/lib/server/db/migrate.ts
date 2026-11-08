import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { loadEnv } from './load-env.js';

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
	console.error('DATABASE_URL is required to apply migrations');
	process.exit(1);
}

const migrationsFolder = join(dirname(fileURLToPath(import.meta.url)), '../../../../drizzle');
const client = postgres(url, { max: 1 });
const db = drizzle(client);

try {
	await migrate(db, { migrationsFolder });
	console.log('Migrations applied successfully');
} finally {
	await client.end();
}
