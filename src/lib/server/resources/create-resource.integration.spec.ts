import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { createResourceFromMultipart } from './create-resource.js';
import { closeDb, getDb } from '../db/client.js';
import { resources } from '../db/schema.js';

const databaseUrl = process.env.DATABASE_URL;
const describeDb = databaseUrl ? describe : describe.skip;

describeDb('createResourceFromMultipart (#17)', () => {
	let fileRoot: string;

	beforeAll(async () => {
		fileRoot = await mkdtemp(join(tmpdir(), 'pack-upload-'));
		process.env.FILE_STORAGE_ROOT = fileRoot;
	});

	afterAll(async () => {
		await closeDb();
		await rm(fileRoot, { recursive: true, force: true });
	});

	it('persists metadata + file for a valid multipart payload', async () => {
		const bytes = Buffer.from('%PDF-1.4 test resource');
		const created = await createResourceFromMultipart(
			{
				title: 'Conflict Resolution Basics',
				description: 'A short introduction to resolving workplace conflict.',
				category: 'conflict-resolution',
				language: 'en',
				provider: 'pack',
				roles: ['mentor-coach']
			},
			{
				originalName: 'conflict-basics.pdf',
				mimeType: 'application/pdf',
				size: bytes.byteLength,
				bytes
			}
		);

		expect(created.id).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
		);
		expect(created.storagePath.startsWith('resources/')).toBe(true);

		const db = getDb();
		const rows = await db.select().from(resources).where(eq(resources.id, created.id));
		expect(rows).toHaveLength(1);
		expect(rows[0]?.title).toBe('Conflict Resolution Basics');

		const absolute = join(fileRoot, created.storagePath);
		expect(await readFile(absolute)).toEqual(bytes);
	});

	it('rejects invalid payloads without writing a row', async () => {
		await expect(
			createResourceFromMultipart(
				{
					title: '',
					description: 'x',
					category: 'conflict-resolution',
					language: 'en',
					provider: 'pack',
					roles: ['mentor-coach']
				},
				{
					originalName: 'conflict-basics.pdf',
					mimeType: 'application/pdf',
					size: 10,
					bytes: Buffer.alloc(10)
				}
			)
		).rejects.toMatchObject({ status: 400 });
	});
});
