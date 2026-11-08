import { describe, expect, it } from 'vitest';
import { UPLOAD_DIALOG_LANDMARKS, UPLOAD_DIALOG_MAX_WIDTH_PX } from './upload-dialog.js';

describe('Upload Resource modal structure (#20)', () => {
	it('exposes Image 1–2 landmarks', () => {
		expect(UPLOAD_DIALOG_LANDMARKS).toEqual(
			expect.arrayContaining([
				'upload-resource-dialog',
				'upload-resource-title',
				'upload-resource-description',
				'upload-resource-category',
				'upload-resource-language',
				'upload-resource-provider',
				'upload-resource-role',
				'upload-resource-file',
				'upload-resource-select-file',
				'upload-resource-submit',
				'upload-resource-close'
			])
		);
	});

	it('locks the Pack modal max-width contract (~560–640px)', () => {
		expect(UPLOAD_DIALOG_MAX_WIDTH_PX).toBeGreaterThanOrEqual(560);
		expect(UPLOAD_DIALOG_MAX_WIDTH_PX).toBeLessThanOrEqual(640);
	});
});
