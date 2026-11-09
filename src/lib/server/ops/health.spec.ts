import { afterEach, describe, expect, it } from 'vitest';
import { checkHealth } from './health.js';

describe('checkHealth (#46)', () => {
	const previous = process.env.DATABASE_URL;

	afterEach(() => {
		if (previous === undefined) {
			delete process.env.DATABASE_URL;
		} else {
			process.env.DATABASE_URL = previous;
		}
	});

	it('skips DB when DATABASE_URL is unset', async () => {
		delete process.env.DATABASE_URL;
		await expect(checkHealth(undefined)).resolves.toEqual({ status: 'ok', db: 'skipped' });
	});

	it('reports degraded when DATABASE_URL is unreachable', async () => {
		const report = await checkHealth('postgresql://pack:wrong@127.0.0.1:1/pack_challenge_missing');
		expect(report).toEqual({ status: 'degraded', db: 'error' });
	});
});
