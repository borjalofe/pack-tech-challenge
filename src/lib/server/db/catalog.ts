/** Pack dropdown catalog values (data only — Zod arrives in a later issue). */

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
