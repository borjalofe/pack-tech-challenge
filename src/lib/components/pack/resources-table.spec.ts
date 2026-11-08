import { describe, expect, it } from 'vitest';
import { RESOURCE_UPLOADED_TOAST, RESOURCES_TABLE_LANDMARKS } from './resources-table.js';
import { PACK_TOKENS } from '#lib/styles/tokens.js';

describe('Resources table + toast structure (#21)', () => {
	it('exposes Image 3 landmarks', () => {
		expect(RESOURCES_TABLE_LANDMARKS).toEqual(
			expect.arrayContaining([
				'resources-table',
				'resources-table-title-sort',
				'resources-table-row',
				'resources-table-provider-pill',
				'resources-table-type-pill',
				'resources-table-row-actions',
				'resources-success-toast'
			])
		);
	});

	it('locks the Pack success toast copy', () => {
		expect(RESOURCE_UPLOADED_TOAST).toBe('Resource Uploaded Successfully!');
	});

	it('uses the Pack success token for the toast check icon', () => {
		expect(PACK_TOKENS.color.success.toLowerCase()).toBe('#1c9c70');
	});
});
