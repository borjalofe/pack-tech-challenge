import { randomUUID } from 'node:crypto';
import path from 'node:path';
import type { ResourceFileMimeType } from '../db/catalog.js';

const MIME_EXTENSION: Record<ResourceFileMimeType, string> = {
	'application/pdf': '.pdf',
	'application/msword': '.doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
	'application/vnd.ms-powerpoint': '.ppt',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
	'video/mp4': '.mp4',
	'video/webm': '.webm',
	'image/png': '.png',
	'image/jpeg': '.jpg',
	'text/plain': '.txt'
};

/** Relative object key under the storage root — never derived from client path segments. */
export function buildResourceObjectKey(mimeType: ResourceFileMimeType): string {
	return path.posix.join('resources', `${randomUUID()}${MIME_EXTENSION[mimeType]}`);
}

/**
 * Resolve a relative storage key under `root`. Rejects absolute keys and traversal.
 * Returns the absolute path when safe; otherwise `null`.
 */
export function resolveStoragePath(root: string, storageKey: string): string | null {
	const normalizedRoot = path.resolve(root);
	const trimmed = storageKey.trim();
	if (!trimmed || path.isAbsolute(trimmed)) {
		return null;
	}
	if (trimmed.split(/[/\\]/).some((segment) => segment === '..')) {
		return null;
	}

	const absolute = path.resolve(normalizedRoot, trimmed);
	const rootWithSep = normalizedRoot.endsWith(path.sep)
		? normalizedRoot
		: normalizedRoot + path.sep;
	if (absolute !== normalizedRoot && !absolute.startsWith(rootWithSep)) {
		return null;
	}
	return absolute;
}
