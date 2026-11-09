import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
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
import { catalogEntries } from './schema.js';

/** Form dropdown labels — safe for production migrate/start (no resource rows). */
export async function seedCatalog(db: PostgresJsDatabase): Promise<number> {
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

	await db.insert(catalogEntries).values(rows).onConflictDoNothing();
	return rows.length;
}
