import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {
	RESOURCE_CATEGORIES,
	RESOURCE_CATEGORY_LABELS,
	RESOURCE_LANGUAGE_LABELS,
	RESOURCE_LANGUAGES,
	RESOURCE_PROVIDER_LABELS,
	RESOURCE_PROVIDERS,
	RESOURCE_ROLE_LABELS,
	RESOURCE_ROLES
} from './catalog.js';
import { loadEnv } from './load-env.js';
import { catalogEntries } from './schema.js';

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
	console.error('DATABASE_URL is required to seed catalog');
	process.exit(1);
}

const rows = [
	...RESOURCE_CATEGORIES.map((slug) => ({
		kind: 'category' as const,
		slug,
		label: RESOURCE_CATEGORY_LABELS[slug]
	})),
	...RESOURCE_LANGUAGES.map((slug) => ({
		kind: 'language' as const,
		slug,
		label: RESOURCE_LANGUAGE_LABELS[slug]
	})),
	...RESOURCE_PROVIDERS.map((slug) => ({
		kind: 'provider' as const,
		slug,
		label: RESOURCE_PROVIDER_LABELS[slug]
	})),
	...RESOURCE_ROLES.map((slug) => ({
		kind: 'role' as const,
		slug,
		label: RESOURCE_ROLE_LABELS[slug]
	}))
];

const client = postgres(url, { max: 1 });
const db = drizzle(client);

try {
	await db.insert(catalogEntries).values(rows).onConflictDoNothing();
	console.log(`Catalog seed upserted (${rows.length} rows)`);
} finally {
	await client.end();
}
