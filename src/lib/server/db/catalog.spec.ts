import { describe, expect, it } from 'vitest';
import {
	RESOURCE_CATEGORY_LABELS,
	RESOURCE_LANGUAGE_LABELS,
	RESOURCE_PROVIDER_LABELS,
	RESOURCE_ROLE_LABELS
} from './catalog.js';

describe('catalog seed labels (#16)', () => {
	it('includes Pack Image-2 dropdown labels', () => {
		expect(RESOURCE_CATEGORY_LABELS['conflict-resolution']).toBe('Conflict Resolution');
		expect(RESOURCE_LANGUAGE_LABELS.en).toBe('English');
		expect(RESOURCE_PROVIDER_LABELS.pack).toBe('Pack');
		expect(RESOURCE_ROLE_LABELS['mentor-coach']).toBe('Mentor / Coach');
		expect(RESOURCE_ROLE_LABELS['mentee-coachee']).toBe('Mentee / Coachee');
	});
});
