import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 4173);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

/**
 * Upload Resource modal (#20) e2e against the Node adapter build.
 * Build must bake the same ORIGIN (kit.paths.origin) as baseURL for multipart CSRF.
 * CI: `ORIGIN=$E2E_BASE_URL pnpm run build` then `pnpm test:e2e`.
 */
export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL,
		trace: 'on-first-retry',
		...devices['Desktop Chrome']
	},
	webServer: {
		command: `HOST=127.0.0.1 PORT=${port} node build`,
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		env: {
			...process.env,
			HOST: '127.0.0.1',
			PORT: String(port)
		}
	}
});
