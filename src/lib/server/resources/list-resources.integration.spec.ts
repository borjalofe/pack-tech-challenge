import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createResourceFromMultipart } from './create-resource.js';
import { listResources } from './list-resources.js';
import { closeDb } from '../db/client.js';

const databaseUrl = process.env.DATABASE_URL;
const describeDb = databaseUrl ? describe : describe.skip;

describeDb('listResources (#18)', () => {
	let fileRoot: string;

	beforeAll(async () => {
		fileRoot = await mkdtemp(join(tmpdir(), 'pack-list-'));
		process.env.FILE_STORAGE_ROOT = fileRoot;
	});

	afterAll(async () => {
		await closeDb();
		await rm(fileRoot, { recursive: true, force: true });
	});

	it('returns an empty items array when no matching fixture is required', async () => {
		const listed = await listResources();
		expect(listed).toEqual(
			expect.objectContaining({
				items: expect.any(Array),
				total: expect.any(Number)
			})
		);
		expect(listed.total).toBe(listed.items.length);
		for (const item of listed.items) {
			expect(item).not.toHaveProperty('storagePath');
			expect(item).toEqual(
				expect.objectContaining({
					id: expect.any(String),
					title: expect.any(String),
					fileOriginalName: expect.any(String),
					viewCount: expect.any(Number),
					provider: expect.any(String),
					category: expect.any(String)
				})
			);
		}
	});

	it('includes a resource after upload', async () => {
		const bytes = Buffer.from('%PDF-1.4 list fixture');
		const created = await createResourceFromMultipart(
			{
				title: 'List Fixture Resource',
				description: 'Created for list API coverage.',
				category: 'leadership',
				language: 'en',
				provider: 'pack',
				roles: ['mentee-coachee']
			},
			{
				originalName: 'list-fixture.pdf',
				mimeType: 'application/pdf',
				size: bytes.byteLength,
				bytes
			}
		);

		const listed = await listResources();
		expect(listed.total).toBeGreaterThanOrEqual(1);
		const match = listed.items.find((item) => item.id === created.id);
		expect(match).toEqual(
			expect.objectContaining({
				id: created.id,
				title: 'List Fixture Resource',
				fileOriginalName: 'list-fixture.pdf',
				provider: 'pack',
				category: 'leadership',
				viewCount: 0,
				uploadedBy: null
			})
		);
		expect(match).not.toHaveProperty('storagePath');
	});
});
