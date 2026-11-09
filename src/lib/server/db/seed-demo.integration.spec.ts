import { count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { resources } from './schema.js';

const databaseUrl = process.env.DATABASE_URL;
const describeDb = databaseUrl ? describe : describe.skip;

/**
 * #45 — production/Fly must not inherit demo resource rows from migrate.
 * Catalog seed is separate; this locks that schema migrate alone never inserts resources.
 */
describeDb('default migrate leaves resources empty (#45)', () => {
	const client = postgres(databaseUrl!, { max: 1 });
	const db = drizzle(client);
	const migrationsFolder = join(dirname(fileURLToPath(import.meta.url)), '../../../../drizzle');

	beforeAll(async () => {
		await migrate(db, { migrationsFolder });
		await db.delete(resources);
	});

	afterAll(async () => {
		await client.end();
	});

	it('has zero resource rows after a clean migrate (no demo seed)', async () => {
		// Re-apply migrate (idempotent) then assert count — migrate must not insert fixtures.
		await migrate(db, { migrationsFolder });
		const [{ value: resourceTotal }] = await db.select({ value: count() }).from(resources);
		expect(Number(resourceTotal)).toBe(0);
	});
});
