import type { ResourceRow } from '../db/schema.js';

/** Public resource fields for create/list responses — never includes storagePath. */
export type PublicResource = {
	id: string;
	title: string;
	description: string;
	category: string;
	language: string;
	provider: string;
	roles: string[];
	/** Display filename / path column for the table UI. */
	fileOriginalName: string;
	fileMimeType: string;
	fileSize: number;
	viewCount: number;
	uploadedBy: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export function toPublicResource(row: ResourceRow): PublicResource {
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
		viewCount: row.viewCount,
		uploadedBy: row.uploadedBy,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}
