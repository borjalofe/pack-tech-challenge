import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { loadEnv } from './load-env.js';
import * as schema from './schema.js';

loadEnv();

let client: ReturnType<typeof postgres> | undefined;
let db: PostgresJsDatabase<typeof schema> | undefined;

export function getDb(): PostgresJsDatabase<typeof schema> {
	const url = process.env.DATABASE_URL;
	if (!url) {
		throw new Error('DATABASE_URL is required');
	}
	if (!db) {
		client = postgres(url, { max: 10 });
		db = drizzle(client, { schema });
	}
	return db;
}

export async function closeDb(): Promise<void> {
	if (client) {
		await client.end({ timeout: 5 });
		client = undefined;
		db = undefined;
	}
}
