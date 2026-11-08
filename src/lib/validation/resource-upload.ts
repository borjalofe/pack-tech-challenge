/**
 * Canonical resource upload schema for client + server.
 * Form UI must import this module (thin File adapter allowed); do not duplicate rules.
 */
import { z } from 'zod';
import {
	RESOURCE_CATEGORIES,
	RESOURCE_DESCRIPTION_MAX,
	RESOURCE_FILE_MIME_TYPES,
	RESOURCE_FILE_NAME_MAX,
	RESOURCE_FILE_SIZE_MAX,
	RESOURCE_LANGUAGES,
	RESOURCE_PROVIDERS,
	RESOURCE_ROLES,
	RESOURCE_TITLE_MAX
} from '../catalog.js';

export const resourceRoleSchema = z.enum(RESOURCE_ROLES);
export const resourceCategorySchema = z.enum(RESOURCE_CATEGORIES);
export const resourceLanguageSchema = z.enum(RESOURCE_LANGUAGES);
export const resourceProviderSchema = z.enum(RESOURCE_PROVIDERS);
export const resourceFileMimeTypeSchema = z.enum(RESOURCE_FILE_MIME_TYPES);

/** Uploaded file metadata on create (storage path is assigned server-side). */
export const resourceFileMetadataSchema = z.object({
	originalName: z
		.string()
		.trim()
		.min(1, 'File name is required')
		.max(RESOURCE_FILE_NAME_MAX, `File name must be ≤ ${RESOURCE_FILE_NAME_MAX} characters`),
	mimeType: resourceFileMimeTypeSchema,
	size: z
		.number()
		.int('File size must be an integer')
		.positive('File size must be greater than 0')
		.max(RESOURCE_FILE_SIZE_MAX, `File size must be ≤ ${RESOURCE_FILE_SIZE_MAX} bytes`)
});

export type ResourceFileMetadata = z.infer<typeof resourceFileMetadataSchema>;

/**
 * Create payload shared by the multipart API and future SvelteKit clients.
 * Roles: at least one of Mentor/Coach, Mentee/Coachee; duplicates removed.
 */
export const resourceCreateSchema = z.object({
	title: z
		.string()
		.trim()
		.min(1, 'Title is required')
		.max(RESOURCE_TITLE_MAX, `Title must be ≤ ${RESOURCE_TITLE_MAX} characters`),
	description: z
		.string()
		.trim()
		.min(1, 'Description is required')
		.max(RESOURCE_DESCRIPTION_MAX, `Description must be ≤ ${RESOURCE_DESCRIPTION_MAX} characters`),
	category: resourceCategorySchema,
	language: resourceLanguageSchema,
	provider: resourceProviderSchema,
	roles: z
		.array(resourceRoleSchema)
		.min(1, 'Select at least one role')
		.transform((roles) => [...new Set(roles)]),
	file: resourceFileMetadataSchema
});

export type ResourceCreateInput = z.input<typeof resourceCreateSchema>;
export type ResourceCreate = z.output<typeof resourceCreateSchema>;
