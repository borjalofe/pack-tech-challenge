import { count, desc } from 'drizzle-orm';
import { getDb } from '../db/client.js';
import { resources } from '../db/schema.js';
import { toPublicResource, type PublicResource } from './public-resource.js';

export type ResourceList = {
	items: PublicResource[];
	total: number;
};

/**
 * List uploaded resources for the table UI.
 * Omits storagePath; search/filter wiring is deferred.
 */
export async function listResources(): Promise<ResourceList> {
	const db = getDb();

	const [{ value: total }] = await db.select({ value: count() }).from(resources);
	const rows = await db.select().from(resources).orderBy(desc(resources.createdAt));

	return {
		items: rows.map(toPublicResource),
		total: Number(total)
	};
}
