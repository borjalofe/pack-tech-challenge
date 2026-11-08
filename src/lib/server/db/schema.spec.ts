import { getTableColumns, getTableName } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import {
	RESOURCE_CATEGORIES,
	RESOURCE_DESCRIPTION_MAX,
	RESOURCE_FILE_NAME_MAX,
	RESOURCE_FILE_SIZE_MAX,
	RESOURCE_LANGUAGES,
	RESOURCE_PROVIDERS,
	RESOURCE_ROLES,
	RESOURCE_TITLE_MAX
} from './catalog.js';
import { resources } from './schema.js';

describe('resources table schema (#16)', () => {
	it('is named resources and exposes list/upload columns', () => {
		expect(getTableName(resources)).toBe('resources');

		const cols = getTableColumns(resources);
		expect(Object.keys(cols).sort()).toEqual(
			[
				'id',
				'title',
				'description',
				'category',
				'language',
				'provider',
				'roles',
				'fileOriginalName',
				'fileMimeType',
				'fileSize',
				'storagePath',
				'viewCount',
				'uploadedBy',
				'createdAt',
				'updatedAt'
			].sort()
		);

		expect(cols.storagePath.name).toBe('storage_path');
		expect(cols.fileOriginalName.name).toBe('file_original_name');
		expect(cols.fileMimeType.name).toBe('file_mime_type');
		expect(cols.fileSize.name).toBe('file_size');
		expect(cols.viewCount.name).toBe('view_count');
		expect(cols.uploadedBy.name).toBe('uploaded_by');
		expect(cols.createdAt.name).toBe('created_at');
		expect(cols.updatedAt.name).toBe('updated_at');
	});

	it('reuses catalog length caps and enum value sets', () => {
		expect(RESOURCE_TITLE_MAX).toBe(200);
		expect(RESOURCE_DESCRIPTION_MAX).toBe(1000);
		expect(RESOURCE_FILE_NAME_MAX).toBe(255);
		expect(RESOURCE_FILE_SIZE_MAX).toBe(50 * 1024 * 1024);
		expect([...RESOURCE_CATEGORIES]).toEqual([
			'conflict-resolution',
			'leadership',
			'communication'
		]);
		expect([...RESOURCE_LANGUAGES]).toEqual(['en', 'es', 'fr']);
		expect([...RESOURCE_PROVIDERS]).toEqual(['pack', 'partner']);
		expect([...RESOURCE_ROLES]).toEqual(['mentor-coach', 'mentee-coachee']);
	});
});
