/**
 * Default seed: form catalogs only. Safe for Compose app start and Fly release.
 * Demo resource rows: `pnpm db:seed:demo` or SEED_DEMO_DATA=true (see seed-demo.ts).
 * Demo deps are loaded lazily so production/Fly images need no storage modules for catalog seed.
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { loadEnv } from './load-env.js';
import { seedCatalog } from './seed-catalog.js';

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
	console.error('DATABASE_URL is required to seed catalog');
	process.exit(1);
}

const client = postgres(url, { max: 1 });
const db = drizzle(client);

try {
	const catalogCount = await seedCatalog(db);
	console.log(`Catalog seed upserted (${catalogCount} rows)`);

	if (process.env.SEED_DEMO_DATA === 'true') {
		const { getFileStorageRoot } = await import('../storage/local-file-store.js');
		const { seedDemoResources } = await import('./seed-demo.js');
		const inserted = await seedDemoResources(db, getFileStorageRoot());
		console.log(
			inserted > 0
				? `Demo resource seed inserted (${inserted} row)`
				: 'Demo resource seed already present (skipped)'
		);
	}
} finally {
	await client.end();
}
