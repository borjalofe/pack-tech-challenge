import { describe, expect, it } from 'vitest';
import { attachmentContentDisposition, isResourceId } from './open-resource.js';

describe('open-resource path safety (#22)', () => {
	it('accepts UUID resource ids only', () => {
		expect(isResourceId('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee')).toBe(true);
		expect(isResourceId('../etc/passwd')).toBe(false);
		expect(isResourceId('resources/foo.pdf')).toBe(false);
		expect(isResourceId('')).toBe(false);
	});

	it('sanitizes Content-Disposition filenames', () => {
		expect(attachmentContentDisposition('report.pdf')).toContain('filename="report.pdf"');
		expect(attachmentContentDisposition('evil"name\n.pdf')).not.toContain('\n');
		expect(attachmentContentDisposition('a/../../x.pdf')).toBe(
			`attachment; filename="a_.._.._x.pdf"; filename*=UTF-8''a_.._.._x.pdf`
		);
	});
});
