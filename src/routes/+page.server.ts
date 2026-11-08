import { listResources } from '#lib/server/resources/list-resources.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const listed = await listResources();
	return {
		items: listed.items.map((item) => ({
			...item,
			createdAt: item.createdAt.toISOString(),
			updatedAt: item.updatedAt.toISOString()
		})),
		total: listed.total
	};
};
