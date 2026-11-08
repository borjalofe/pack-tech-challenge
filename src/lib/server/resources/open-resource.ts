import { eq, sql } from 'drizzle-orm';
import { getDb } from '../db/client.js';
import { resources } from '../db/schema.js';
import { getFileStorageRoot, LocalFileStore } from '../storage/local-file-store.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type OpenableResourceFile = {
	absolutePath: string;
	originalName: string;
	mimeType: string;
	size: number;
};

/** True when `id` is a UUID v1–v8 suitable for resource primary keys. */
export function isResourceId(id: string): boolean {
	return UUID_RE.test(id.trim());
}

/**
 * Resolve a downloadable file by resource id only.
 * Never accepts client-supplied storage paths — lookup goes through the DB row.
 */
export async function openResourceFile(id: string): Promise<OpenableResourceFile | null> {
	if (!isResourceId(id)) {
		return null;
	}

	const db = getDb();
	const [row] = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
	if (!row) {
		return null;
	}

	const files = new LocalFileStore(getFileStorageRoot());
	const absolutePath = await files.resolveExisting(row.storagePath);
	if (!absolutePath) {
		return null;
	}

	await db
		.update(resources)
		.set({
			viewCount: sql`${resources.viewCount} + 1`,
			updatedAt: new Date()
		})
		.where(eq(resources.id, id));

	return {
		absolutePath,
		originalName: row.fileOriginalName,
		mimeType: row.fileMimeType,
		size: row.fileSize
	};
}

/** Build a Content-Disposition attachment header; strip quotes/separators from the filename. */
export function attachmentContentDisposition(originalName: string): string {
	const safe =
		originalName
			.replace(/["\r\n]/g, '_')
			.replace(/[/\\]/g, '_')
			.trim() || 'download';
	// `filename=` must be a ByteString (Latin-1); keep Unicode only in filename*.
	const ascii =
		safe.replace(/[^\x20-\x7E]/g, '_').replace(/[\s_]+/g, '_').replace(/^_|_$/g, '') ||
		'download';
	const encoded = encodeURIComponent(safe);
	return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
