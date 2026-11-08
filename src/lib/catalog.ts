/** Pack dropdown catalog values + file caps shared with Zod upload schema (client + server). */

export const RESOURCE_ROLES = ['mentor-coach', 'mentee-coachee'] as const;
export type ResourceRole = (typeof RESOURCE_ROLES)[number];

export const RESOURCE_ROLE_LABELS: Record<ResourceRole, string> = {
	'mentor-coach': 'Mentor / Coach',
	'mentee-coachee': 'Mentee / Coachee'
};

export const RESOURCE_CATEGORIES = ['conflict-resolution', 'leadership', 'communication'] as const;
export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
	'conflict-resolution': 'Conflict Resolution',
	leadership: 'Leadership',
	communication: 'Communication'
};

export const RESOURCE_LANGUAGES = ['en', 'es', 'fr'] as const;
export type ResourceLanguage = (typeof RESOURCE_LANGUAGES)[number];

export const RESOURCE_LANGUAGE_LABELS: Record<ResourceLanguage, string> = {
	en: 'English',
	es: 'Spanish',
	fr: 'French'
};

export const RESOURCE_PROVIDERS = ['pack', 'partner'] as const;
export type ResourceProvider = (typeof RESOURCE_PROVIDERS)[number];

export const RESOURCE_PROVIDER_LABELS: Record<ResourceProvider, string> = {
	pack: 'Pack',
	partner: 'Partner'
};

export const RESOURCE_TITLE_MAX = 200;
export const RESOURCE_DESCRIPTION_MAX = 1000;
export const RESOURCE_FILE_NAME_MAX = 255;
export const RESOURCE_FILE_SIZE_MAX = 50 * 1024 * 1024; // 50 MiB

/** Allowlisted MIME types for upload metadata validation. */
export const RESOURCE_FILE_MIME_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'video/mp4',
	'video/webm',
	'image/png',
	'image/jpeg',
	'text/plain'
] as const;
export type ResourceFileMimeType = (typeof RESOURCE_FILE_MIME_TYPES)[number];
