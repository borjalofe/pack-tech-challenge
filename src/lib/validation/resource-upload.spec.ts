import { describe, expect, it } from 'vitest';
import {
	RESOURCE_DESCRIPTION_MAX,
	RESOURCE_FILE_SIZE_MAX,
	RESOURCE_ROLES,
	RESOURCE_TITLE_MAX
} from '../server/db/catalog.js';
import { resourceCreateSchema } from './resource-upload.js';

const validCreate = {
	title: 'Conflict Resolution Basics',
	description: 'A short introduction to resolving workplace conflict.',
	category: 'conflict-resolution' as const,
	language: 'en' as const,
	provider: 'pack' as const,
	roles: ['mentor-coach'] as const,
	file: {
		originalName: 'conflict-basics.pdf',
		mimeType: 'application/pdf' as const,
		size: 1024
	}
};

describe('resourceCreateSchema (#17)', () => {
	it('accepts a valid create payload', () => {
		const parsed = resourceCreateSchema.parse(validCreate);
		expect(parsed.title).toBe(validCreate.title);
		expect(parsed.roles).toEqual(['mentor-coach']);
		expect(parsed.file.size).toBe(1024);
	});

	it('rejects title over 200 characters', () => {
		const result = resourceCreateSchema.safeParse({
			...validCreate,
			title: 'x'.repeat(RESOURCE_TITLE_MAX + 1)
		});
		expect(result.success).toBe(false);
	});

	it('rejects description over 1000 characters', () => {
		const result = resourceCreateSchema.safeParse({
			...validCreate,
			description: 'y'.repeat(RESOURCE_DESCRIPTION_MAX + 1)
		});
		expect(result.success).toBe(false);
	});

	it('requires at least one Pack role and dedupes', () => {
		expect(resourceCreateSchema.safeParse({ ...validCreate, roles: [] }).success).toBe(false);
		expect(resourceCreateSchema.safeParse({ ...validCreate, roles: ['unknown'] }).success).toBe(
			false
		);

		const parsed = resourceCreateSchema.parse({
			...validCreate,
			roles: ['mentor-coach', 'mentee-coachee', 'mentor-coach']
		});
		expect(parsed.roles).toEqual([...RESOURCE_ROLES]);
	});

	it('enforces file metadata mime and size caps', () => {
		expect(
			resourceCreateSchema.safeParse({
				...validCreate,
				file: { ...validCreate.file, mimeType: 'application/zip' }
			}).success
		).toBe(false);

		expect(
			resourceCreateSchema.safeParse({
				...validCreate,
				file: { ...validCreate.file, size: RESOURCE_FILE_SIZE_MAX + 1 }
			}).success
		).toBe(false);

		expect(
			resourceCreateSchema.safeParse({
				...validCreate,
				file: { ...validCreate.file, size: 0 }
			}).success
		).toBe(false);
	});
});
