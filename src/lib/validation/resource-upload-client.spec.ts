import { describe, expect, it } from 'vitest';
import { parseUploadFormWithFile } from './resource-upload-client.js';
import { resourceCreateSchema } from './resource-upload.js';

describe('upload form Zod wiring (#20)', () => {
	it('imports the shared resourceCreateSchema (single contract)', () => {
		expect(typeof resourceCreateSchema.safeParse).toBe('function');
	});

	it('accepts a valid File via the thin client adapter', () => {
		const file = new File(['%PDF-1.4'], 'guide.pdf', { type: 'application/pdf' });
		const parsed = parseUploadFormWithFile(
			{
				title: 'Conflict Resolution Basics',
				description: 'A short introduction',
				category: 'conflict-resolution',
				language: 'en',
				provider: 'pack',
				roles: ['mentor-coach']
			},
			file
		);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.file.originalName).toBe('guide.pdf');
			expect(parsed.data.file.mimeType).toBe('application/pdf');
		}
	});

	it('rejects empty title and missing file', () => {
		expect(
			parseUploadFormWithFile(
				{
					title: '',
					description: 'x',
					category: 'conflict-resolution',
					language: 'en',
					provider: 'pack',
					roles: ['mentor-coach']
				},
				new File(['x'], 'a.pdf', { type: 'application/pdf' })
			).success
		).toBe(false);

		expect(
			parseUploadFormWithFile(
				{
					title: 'Title',
					description: 'Description',
					category: 'conflict-resolution',
					language: 'en',
					provider: 'pack',
					roles: ['mentor-coach']
				},
				null
			).success
		).toBe(false);
	});
});
