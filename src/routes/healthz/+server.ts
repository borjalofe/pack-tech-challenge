import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkHealth } from '#lib/server/ops/health.js';

/** Production/Compose readiness probe — optional DB ping when DATABASE_URL is set. */
export const GET: RequestHandler = async () => {
	const report = await checkHealth();
	return json(report, { status: report.status === 'ok' ? 200 : 503 });
};
