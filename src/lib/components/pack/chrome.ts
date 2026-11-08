/** Image-3 chrome landmarks owned by this issue (no modal / table body). */
export const packChromeLandmarks = [
	'app-header',
	'resources-card',
	'resources-toolbar',
	'search-field',
	'upload-button',
	'support-chat-fab'
] as const;

export type PackChromeLandmark = (typeof packChromeLandmarks)[number];

export type PackNavItem = {
	href: string;
	label: string;
	active?: boolean;
};

/** Top-nav labels from Pack brand screenshots. */
export const PACK_NAV_ITEMS: readonly PackNavItem[] = [
	{ href: '#dashboard', label: 'Dashboard' },
	{ href: '#users', label: 'Users' },
	{ href: '#feedbacks', label: 'Feedbacks' },
	{ href: '#programs', label: 'Programs' },
	{ href: '#resources', label: 'Resources', active: true },
	{ href: '#counterparties', label: 'Counterparties' },
	{ href: '#events', label: 'Events' }
];

/** Presentational type tabs — filter wiring is deferred. */
export const PACK_RESOURCE_TABS = ['All', 'Videos', 'Documents', 'Lessons', 'Archive'] as const;
