/**
 * Explicit local demo seed: catalogs + one sample resource.
 * Equivalent to SEED_DEMO_DATA=true pnpm db:seed.
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getFileStorageRoot } from '../storage/local-file-store.js';
import { loadEnv } from './load-env.js';
import { seedCatalog } from './seed-catalog.js';
import { seedDemoResources } from './seed-demo.js';

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
	console.error('DATABASE_URL is required to seed demo data');
	process.exit(1);
}

const client = postgres(url, { max: 1 });
const db = drizzle(client);

try {
	const catalogCount = await seedCatalog(db);
	console.log(`Catalog seed upserted (${catalogCount} rows)`);
	const inserted = await seedDemoResources(db, getFileStorageRoot());
	console.log(
		inserted > 0
			? `Demo resource seed inserted (${inserted} row)`
			: 'Demo resource seed already present (skipped)'
	);
} finally {
	await client.end();
}
