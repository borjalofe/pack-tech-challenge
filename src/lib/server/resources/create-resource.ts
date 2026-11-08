import { error } from '@sveltejs/kit';
import {
	RESOURCE_FILE_MIME_TYPES,
	RESOURCE_FILE_SIZE_MAX,
	type ResourceFileMimeType
} from '../db/catalog.js';
import { getDb } from '../db/client.js';
import { resources, type ResourceRow } from '../db/schema.js';
import { getFileStorageRoot, LocalFileStore } from '../storage/local-file-store.js';
import { resourceCreateSchema } from '../../validation/resource-upload.js';

export type MultipartResourceFields = {
	title?: string;
	description?: string;
	category?: string;
	language?: string;
	provider?: string;
	roles?: string | string[];
};

export type UploadedFileBytes = {
	originalName: string;
	mimeType: string;
	size: number;
	bytes: Buffer;
};

export type CreatedResource = {
	id: string;
	title: string;
	description: string;
	category: string;
	language: string;
	provider: string;
	roles: string[];
	fileOriginalName: string;
	fileMimeType: string;
	fileSize: number;
	storagePath: string;
	viewCount: number;
	uploadedBy: string | null;
	createdAt: Date;
	updatedAt: Date;
};

function parseRoles(roles: string | string[] | undefined): string[] {
	if (roles == null) {
		return [];
	}
	if (Array.isArray(roles)) {
		return roles.flatMap((value) => splitRoles(value));
	}
	const trimmed = roles.trim();
	if (trimmed.startsWith('[')) {
		try {
			const parsed: unknown = JSON.parse(trimmed);
			if (Array.isArray(parsed)) {
				return parsed.map(String);
			}
		} catch {
			// fall through
		}
	}
	return splitRoles(trimmed);
}

function splitRoles(value: string): string[] {
	return value
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean);
}

function toPublicResource(row: ResourceRow): CreatedResource {
	return {
		id: row.id,
		title: row.title,
		description: row.description,
		category: row.category,
		language: row.language,
		provider: row.provider,
		roles: row.roles,
		fileOriginalName: row.fileOriginalName,
		fileMimeType: row.fileMimeType,
		fileSize: row.fileSize,
		storagePath: row.storagePath,
		viewCount: row.viewCount,
		uploadedBy: row.uploadedBy,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}

export async function createResourceFromMultipart(
	fields: MultipartResourceFields,
	file: UploadedFileBytes | undefined
): Promise<CreatedResource> {
	if (!file) {
		error(400, 'File is required');
	}

	if (file.size > RESOURCE_FILE_SIZE_MAX) {
		error(413, `File size must be ≤ ${RESOURCE_FILE_SIZE_MAX} bytes`);
	}

	const mimeType = file.mimeType as ResourceFileMimeType;
	if (!(RESOURCE_FILE_MIME_TYPES as readonly string[]).includes(mimeType)) {
		error(415, `MIME type not allowed: ${file.mimeType}`);
	}

	const parsed = resourceCreateSchema.safeParse({
		title: fields.title,
		description: fields.description,
		category: fields.category,
		language: fields.language,
		provider: fields.provider,
		roles: parseRoles(fields.roles),
		file: {
			originalName: file.originalName,
			mimeType,
			size: file.size
		}
	});

	if (!parsed.success) {
		const details = parsed.error.issues
			.map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
			.join('; ');
		error(400, `Validation failed: ${details}`);
	}

	const files = new LocalFileStore(getFileStorageRoot());
	const stored = await files.writeResourceFile(mimeType, file.bytes);

	try {
		const db = getDb();
		const [row] = await db
			.insert(resources)
			.values({
				title: parsed.data.title,
				description: parsed.data.description,
				category: parsed.data.category,
				language: parsed.data.language,
				provider: parsed.data.provider,
				roles: parsed.data.roles,
				fileOriginalName: parsed.data.file.originalName,
				fileMimeType: parsed.data.file.mimeType,
				fileSize: parsed.data.file.size,
				storagePath: stored.storagePath
			})
			.returning();

		if (!row) {
			throw new Error('Insert returned no row');
		}

		return toPublicResource(row);
	} catch (err) {
		await files.delete(stored.storagePath);
		throw err;
	}
}
