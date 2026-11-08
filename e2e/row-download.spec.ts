import { expect, test } from '@playwright/test';
import { RESOURCE_UPLOADED_TOAST } from '../src/lib/components/pack/resources-table.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fixturePdf = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'fixtures',
	'sample.pdf'
);
const fixtureBytes = readFileSync(fixturePdf);

test.describe('Row download/open happy path (#22)', () => {
	test('upload → toast → row → download succeeds', async ({ page }) => {
		const title = `Download E2E ${Date.now()}`;

		await page.goto('/');
		await page.getByRole('button', { name: 'Upload' }).click();
		await page.locator('[data-slot="upload-resource-title"]').fill(title);
		await page
			.locator('[data-slot="upload-resource-description"]')
			.fill('Happy path open/download');
		await page.locator('[data-slot="upload-resource-category"]').selectOption('communication');
		await page.locator('[data-slot="upload-resource-language"]').selectOption('en');
		await page.locator('[data-slot="upload-resource-provider"]').selectOption('partner');
		await page.locator('[data-slot="upload-resource-role"] button').click();
		await page.getByRole('checkbox', { name: 'Mentee / Coachee' }).check();
		await page
			.locator('[data-slot="upload-resource-file"] input[type="file"]')
			.setInputFiles(fixturePdf);
		await page.locator('[data-slot="upload-resource-submit"]').click();

		await expect(page.locator('[data-slot="resources-success-toast"]')).toContainText(
			RESOURCE_UPLOADED_TOAST
		);

		const row = page.locator('[data-slot="resources-table-row"]').filter({ hasText: title });
		await expect(row).toBeVisible();

		const downloadPromise = page.waitForEvent('download');
		await row.locator('[data-slot="resources-table-open"]').click();
		const download = await downloadPromise;

		expect(download.suggestedFilename()).toBe('sample.pdf');
		const downloadPath = await download.path();
		expect(downloadPath).toBeTruthy();
		if (!downloadPath) return;
		expect(readFileSync(downloadPath)).toEqual(fixtureBytes);
	});
});
