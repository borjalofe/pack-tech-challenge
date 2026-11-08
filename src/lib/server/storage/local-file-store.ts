import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ResourceFileMimeType } from '../db/catalog.js';
import { buildResourceObjectKey, resolveStoragePath } from './object-key.js';

export type StoredObject = { storagePath: string };

export class LocalFileStore {
	constructor(private readonly root: string) {}

	getRoot(): string {
		return this.root;
	}

	async writeResourceFile(mimeType: ResourceFileMimeType, bytes: Buffer): Promise<StoredObject> {
		const storagePath = buildResourceObjectKey(mimeType);
		const absolutePath = resolveStoragePath(this.root, storagePath);
		if (!absolutePath) {
			throw new Error('Refusing to write outside the file storage root');
		}

		await mkdir(path.dirname(absolutePath), { recursive: true });
		await writeFile(absolutePath, bytes, { flag: 'wx' });
		return { storagePath };
	}

	async delete(storagePath: string): Promise<void> {
		const absolutePath = resolveStoragePath(this.root, storagePath);
		if (!absolutePath) {
			return;
		}
		await unlink(absolutePath).catch(() => undefined);
	}

	async exists(storagePath: string): Promise<boolean> {
		const absolutePath = resolveStoragePath(this.root, storagePath);
		if (!absolutePath) {
			return false;
		}
		try {
			await access(absolutePath);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Resolve a stored object to an absolute path under the root.
	 * Returns null when the key is unsafe or the file is missing (no directory listing).
	 */
	async resolveExisting(storagePath: string): Promise<string | null> {
		const absolutePath = resolveStoragePath(this.root, storagePath);
		if (!absolutePath) {
			return null;
		}
		try {
			await access(absolutePath);
			return absolutePath;
		} catch {
			return null;
		}
	}
}

export function getFileStorageRoot(): string {
	return process.env.FILE_STORAGE_ROOT?.trim() || 'var/file-store';
}
