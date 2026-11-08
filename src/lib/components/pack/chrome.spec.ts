import { describe, expect, it } from 'vitest';
import {
	PACK_NAV_ITEMS,
	PACK_RESOURCE_TABS,
	packChromeLandmarks
} from './chrome.js';

describe('Pack chrome shell (#19)', () => {
	it('exposes Image-3 chrome landmarks without table or modal ownership', () => {
		expect(packChromeLandmarks).toEqual(
			expect.arrayContaining([
				'app-header',
				'resources-card',
				'resources-toolbar',
				'search-field',
				'upload-button',
				'support-chat-fab'
			])
		);
		expect(packChromeLandmarks).not.toContain('upload-modal');
		expect(packChromeLandmarks).not.toContain('resources-table-body');
	});

	it('keeps Resources active in the Pack top nav', () => {
		const resources = PACK_NAV_ITEMS.find((item) => item.label === 'Resources');
		expect(resources?.active).toBe(true);
		expect(PACK_NAV_ITEMS.map((item) => item.label)).toEqual([
			'Dashboard',
			'Users',
			'Feedbacks',
			'Programs',
			'Resources',
			'Counterparties',
			'Events'
		]);
	});

	it('lists presentational type tabs for the toolbar', () => {
		expect(PACK_RESOURCE_TABS).toEqual(['All', 'Videos', 'Documents', 'Lessons', 'Archive']);
	});
});
