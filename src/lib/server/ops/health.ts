import postgres from 'postgres';

export type HealthReport = {
	status: 'ok' | 'degraded';
	db: 'ok' | 'error' | 'skipped';
};

/**
 * Liveness/readiness payload for GET /healthz.
 * When DATABASE_URL is set, runs `select 1`; otherwise db is skipped.
 */
export async function checkHealth(databaseUrl = process.env.DATABASE_URL): Promise<HealthReport> {
	if (!databaseUrl?.trim()) {
		return { status: 'ok', db: 'skipped' };
	}

	const client = postgres(databaseUrl, { max: 1, connect_timeout: 5 });
	try {
		await client`select 1`;
		return { status: 'ok', db: 'ok' };
	} catch {
		return { status: 'degraded', db: 'error' };
	} finally {
		await client.end({ timeout: 2 });
	}
}
