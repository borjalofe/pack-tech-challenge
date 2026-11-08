import { resourceCreateSchema, type ResourceCreate } from './resource-upload.js';

/**
 * Untyped form values before Zod. Empty selects are `""` until the user picks.
 * Validation still runs through the shared `resourceCreateSchema`.
 */
export type UploadFormFields = {
	title: string;
	description: string;
	category: string;
	language: string;
	provider: string;
	roles: string[];
};

/**
 * Thin client adapter: map a browser `File` into the shared Zod create schema.
 * Do not duplicate business rules here — server still validates with the same schema.
 */
export function parseUploadFormWithFile(fields: UploadFormFields, file: File | null) {
	if (!file) {
		return resourceCreateSchema.safeParse({
			...fields,
			file: undefined
		});
	}

	return resourceCreateSchema.safeParse({
		...fields,
		file: {
			originalName: file.name,
			mimeType: file.type || 'application/octet-stream',
			size: file.size
		}
	});
}

export type ParsedUploadForm = ResourceCreate;
