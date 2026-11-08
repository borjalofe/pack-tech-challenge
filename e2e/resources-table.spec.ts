import { expect, test } from '@playwright/test';
import { RESOURCE_UPLOADED_TOAST } from '../src/lib/components/pack/resources-table.js';
import { PACK_TOKENS } from '../src/lib/styles/tokens.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fixturePdf = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	'fixtures',
	'sample.pdf'
);

test.describe('Resources table + toast (#21)', () => {
	test('Image 3 structure: columns, pills, sort, row actions', async ({ page }) => {
		const title = `Table E2E Resource ${Date.now()}`;

		await page.goto('/');

		const table = page.locator('[data-slot="resources-table"]');
		await expect(table).toBeVisible();
		await expect(table.getByRole('columnheader', { name: /Content Title/i })).toBeVisible();
		await expect(table.getByRole('columnheader', { name: 'Path' })).toBeVisible();
		await expect(table.getByRole('columnheader', { name: 'View Count' })).toBeVisible();
		await expect(table.getByRole('columnheader', { name: 'Uploaded By' })).toBeVisible();
		await expect(table.getByRole('columnheader', { name: 'Provider' })).toBeVisible();
		await expect(table.getByRole('columnheader', { name: 'Type' })).toBeVisible();

		await expect(page.locator('[data-slot="resources-table-title-sort"]')).toBeVisible();

		// Seeded empty table still exposes landmarks via header; after upload we assert pills/actions.
		await page.getByRole('button', { name: 'Upload' }).click();
		await page.locator('[data-slot="upload-resource-title"]').fill(title);
		await page
			.locator('[data-slot="upload-resource-description"]')
			.fill('Image 3 structure coverage');
		await page.locator('[data-slot="upload-resource-category"]').selectOption('leadership');
		await page.locator('[data-slot="upload-resource-language"]').selectOption('en');
		await page.locator('[data-slot="upload-resource-provider"]').selectOption('pack');
		await page.locator('[data-slot="upload-resource-role"] button').click();
		await page.getByRole('checkbox', { name: 'Mentor / Coach' }).check();
		await page
			.locator('[data-slot="upload-resource-file"] input[type="file"]')
			.setInputFiles(fixturePdf);

		await page.locator('[data-slot="upload-resource-submit"]').click();

		const toast = page.locator('[data-slot="resources-success-toast"]');
		await expect(toast).toBeVisible();
		await expect(toast).toContainText(RESOURCE_UPLOADED_TOAST);
		await expect(toast.locator('.check')).toHaveCSS('color', 'rgb(28, 156, 112)');
		expect(PACK_TOKENS.color.success.toLowerCase()).toBe('#1c9c70');

		const row = page.locator('[data-slot="resources-table-row"]').filter({
			hasText: title
		});
		await expect(row).toBeVisible();
		await expect(row.locator('[data-slot="resources-table-provider-pill"]')).toHaveText('Pack');
		await expect(row.locator('[data-slot="resources-table-type-pill"]')).toHaveText('Leadership');
		await expect(row.locator('[data-slot="resources-table-row-actions"]')).toBeVisible();
	});
});
