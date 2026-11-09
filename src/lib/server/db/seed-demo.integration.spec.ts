import { count, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { catalogEntries, resources } from './schema.js';
import { seedCatalog } from './seed-catalog.js';
import { DEMO_SEED_STORAGE_PATH, seedDemoResources } from './seed-demo.js';

const databaseUrl = process.env.DATABASE_URL;
const describeDb = databaseUrl ? describe : describe.skip;

describeDb('default migrate leaves resources empty (#45)', () => {
	const client = postgres(databaseUrl!, { max: 1 });
	const db = drizzle(client);
	const migrationsFolder = join(dirname(fileURLToPath(import.meta.url)), '../../../../drizzle');
	let fileRoot: string;

	beforeAll(async () => {
		fileRoot = await mkdtemp(join(tmpdir(), 'pack-demo-seed-'));
		process.env.FILE_STORAGE_ROOT = fileRoot;
		await migrate(db, { migrationsFolder });
		// Drop only the demo marker row — other suites may insert into the shared CI DB.
		await db.delete(resources).where(eq(resources.storagePath, DEMO_SEED_STORAGE_PATH));
	});

	afterAll(async () => {
		await db.delete(resources).where(eq(resources.storagePath, DEMO_SEED_STORAGE_PATH));
		await client.end();
		await rm(fileRoot, { recursive: true, force: true });
	});

	it('does not create the demo storage key via migrate + catalog seed', async () => {
		await migrate(db, { migrationsFolder });
		await seedCatalog(db);
		const demoRows = await db
			.select()
			.from(resources)
			.where(eq(resources.storagePath, DEMO_SEED_STORAGE_PATH));
		const [{ value: catalogTotal }] = await db.select({ value: count() }).from(catalogEntries);
		expect(demoRows).toHaveLength(0);
		expect(Number(catalogTotal)).toBeGreaterThan(0);
	});

	it('loads demo resource rows only via the opt-in demo seed', async () => {
		const inserted = await seedDemoResources(db, fileRoot);
		expect(inserted).toBe(1);
		const demoRows = await db
			.select()
			.from(resources)
			.where(eq(resources.storagePath, DEMO_SEED_STORAGE_PATH));
		expect(demoRows).toHaveLength(1);

		const again = await seedDemoResources(db, fileRoot);
		expect(again).toBe(0);
		expect(DEMO_SEED_STORAGE_PATH).toContain('demo/');
	});
});
