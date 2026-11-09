import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { LocalFileStore } from '../storage/local-file-store.js';
import { resources } from './schema.js';

/** Stable relative key under FILE_STORAGE_ROOT — never a client path. */
export const DEMO_SEED_STORAGE_PATH = 'demo/pack-local-seed.pdf';

/**
 * Opt-in local DX only: insert a sample resource + blob.
 * Never enable on production/Fly (`SEED_DEMO_DATA` unset / false).
 */
export async function seedDemoResources(db: PostgresJsDatabase, fileRoot: string): Promise<number> {
	const existing = await db
		.select({ id: resources.id })
		.from(resources)
		.where(eq(resources.storagePath, DEMO_SEED_STORAGE_PATH))
		.limit(1);
	if (existing.length > 0) {
		return 0;
	}

	const bytes = Buffer.from('%PDF-1.4\n% Pack local demo seed\n');
	const absolute = join(fileRoot, DEMO_SEED_STORAGE_PATH);
	await mkdir(dirname(absolute), { recursive: true });
	try {
		await writeFile(absolute, bytes, { flag: 'wx' });
	} catch (err) {
		const code = (err as NodeJS.ErrnoException).code;
		if (code !== 'EEXIST') throw err;
	}

	await db.insert(resources).values({
		title: 'Conflict Resolution Basics (demo)',
		description: 'Local demo row for table UX — not used on production/Fly.',
		category: 'conflict-resolution',
		language: 'en',
		provider: 'pack',
		roles: ['mentor-coach'],
		fileOriginalName: 'pack-local-seed.pdf',
		fileMimeType: 'application/pdf',
		fileSize: bytes.byteLength,
		storagePath: DEMO_SEED_STORAGE_PATH,
		viewCount: 0,
		uploadedBy: 'local-demo'
	});

	const files = new LocalFileStore(fileRoot);
	if (!(await files.exists(DEMO_SEED_STORAGE_PATH))) {
		throw new Error('Demo seed wrote a key that resolveStoragePath cannot read');
	}

	return 1;
}
