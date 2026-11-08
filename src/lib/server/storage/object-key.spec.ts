import { describe, expect, it } from 'vitest';
import { buildResourceObjectKey, resolveStoragePath } from './object-key.js';

describe('object-key (#17)', () => {
	it('builds a resources/<uuid>.<ext> key from mime', () => {
		const key = buildResourceObjectKey('application/pdf');
		expect(key).toMatch(/^resources\/[0-9a-f-]{36}\.pdf$/i);
	});

	it('rejects traversal and absolute storage keys', () => {
		expect(resolveStoragePath('/tmp/store', '../etc/passwd')).toBeNull();
		expect(resolveStoragePath('/tmp/store', '/etc/passwd')).toBeNull();
		expect(resolveStoragePath('/tmp/store', 'resources/ok.pdf')).toBe(
			'/tmp/store/resources/ok.pdf'
		);
	});
});
