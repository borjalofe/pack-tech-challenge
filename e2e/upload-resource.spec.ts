import { expect, test } from '@playwright/test';
import { UPLOAD_DIALOG_MAX_WIDTH_PX } from '../src/lib/components/pack/upload-dialog.js';
import { PACK_TOKENS } from '../src/lib/styles/tokens.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fixturePdf = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'fixtures',
	'sample.pdf'
);

test.describe('Upload Resource modal (#20)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Upload' }).click();
		await expect(page.getByRole('dialog', { name: 'Upload Resource' })).toBeVisible();
	});

	test('modal width band, primary token, chevrons, and landmarks', async ({ page }) => {
		const dialog = page.locator('[data-slot="upload-resource-dialog"]');
		const box = await dialog.boundingBox();
		expect(box).toBeTruthy();
		const viewport = page.viewportSize();
		expect(viewport).toBeTruthy();
		if (!box || !viewport) return;

		const widthRatio = box.width / viewport.width;
		const withinHalfViewport = widthRatio >= 0.45 && widthRatio <= 0.55;
		const cappedAtMax =
			Math.abs(box.width - UPLOAD_DIALOG_MAX_WIDTH_PX) <= 2 ||
			box.width <= UPLOAD_DIALOG_MAX_WIDTH_PX + 1;
		expect(withinHalfViewport || cappedAtMax).toBe(true);
		expect(box.width).toBeLessThanOrEqual(UPLOAD_DIALOG_MAX_WIDTH_PX + 1);

		const submit = page.locator('[data-slot="upload-resource-submit"]');
		await expect(submit).toHaveCSS('background-color', 'rgb(252, 128, 52)');
		expect(PACK_TOKENS.color.primary.toLowerCase()).toBe('#fc8034');

		await expect(page.locator('[data-slot="upload-resource-close"]')).toBeVisible();
		await expect(page.locator('[data-slot="upload-resource-select-file"]')).toBeVisible();
		await expect(dialog.locator('.chevron')).toHaveCount(4);

		for (const slot of [
			'upload-resource-title',
			'upload-resource-description',
			'upload-resource-category',
			'upload-resource-language',
			'upload-resource-provider',
			'upload-resource-role',
			'upload-resource-file'
		]) {
			await expect(page.locator(`[data-slot="${slot}"]`)).toBeVisible();
		}
	});

	test('invalid submit is blocked client-side', async ({ page }) => {
		// Satisfy HTML required attrs; omit roles + file so shared Zod rejects.
		await page.locator('[data-slot="upload-resource-title"]').fill('Missing file');
		await page.locator('[data-slot="upload-resource-description"]').fill('Blocked by Zod');
		await page.locator('[data-slot="upload-resource-category"]').selectOption('leadership');
		await page.locator('[data-slot="upload-resource-language"]').selectOption('en');
		await page.locator('[data-slot="upload-resource-provider"]').selectOption('pack');

		await page.locator('[data-slot="upload-resource-submit"]').click();
		await expect(page.getByRole('alert')).toBeVisible();
		await expect(page.getByRole('dialog', { name: 'Upload Resource' })).toBeVisible();
	});

	test('valid submit posts to the upload API', async ({ page }) => {
		await page.locator('[data-slot="upload-resource-title"]').fill('E2E Conflict Guide');
		await page
			.locator('[data-slot="upload-resource-description"]')
			.fill('Uploaded from Playwright');
		await page
			.locator('[data-slot="upload-resource-category"]')
			.selectOption('conflict-resolution');
		await page.locator('[data-slot="upload-resource-language"]').selectOption('en');
		await page.locator('[data-slot="upload-resource-provider"]').selectOption('pack');

		await page.locator('[data-slot="upload-resource-role"] button').click();
		await page.getByRole('checkbox', { name: 'Mentor / Coach' }).check();

		await page
			.locator('[data-slot="upload-resource-file"] input[type="file"]')
			.setInputFiles(fixturePdf);

		const responsePromise = page.waitForResponse(
			(response) =>
				response.url().includes('/api/resources') && response.request().method() === 'POST'
		);
		await page.locator('[data-slot="upload-resource-submit"]').click();
		const response = await responsePromise;
		expect(response.ok()).toBe(true);
		await expect(page.getByRole('dialog', { name: 'Upload Resource' })).toHaveCount(0);
	});
});
