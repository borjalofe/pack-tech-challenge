import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { afterAll, describe, expect, it } from 'vitest';
import { catalogEntries, resources } from './schema.js';

const databaseUrl = process.env.DATABASE_URL;
const describeDb = databaseUrl ? describe : describe.skip;

describeDb('db migrate + catalog seed (#16)', () => {
	const client = postgres(databaseUrl!, { max: 1 });
	const db = drizzle(client);
	const migrationsFolder = join(dirname(fileURLToPath(import.meta.url)), '../../../../drizzle');

	afterAll(async () => {
		await client.end();
	});

	it('applies migrations cleanly and exposes resources + catalog_entries', async () => {
		await migrate(db, { migrationsFolder });

		const resourceRows = await db.select().from(resources).limit(1);
		expect(Array.isArray(resourceRows)).toBe(true);

		const catalogRows = await db.select().from(catalogEntries).limit(1);
		expect(Array.isArray(catalogRows)).toBe(true);
	});
});
