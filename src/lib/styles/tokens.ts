/**
 * Pack visual token anchors (audited from docs/brand screenshots + brief).
 * CSS custom properties in tokens.css must stay in sync — chrome uses the CSS vars.
 */
export const PACK_TOKENS = {
	color: {
		primary: '#FC8034',
		page: '#F9FAFC',
		surface: '#FFFFFF',
		success: '#1C9C70',
		muted: '#5C5C5C',
		foreground: '#1A1A1A',
		border: '#E0E0E0'
	},
	radius: {
		sm: '4px',
		md: '8px'
	},
	width: {
		/** Content card max-width — comparable to Image-3 card, not full-bleed. */
		content: '1120px'
	},
	shadow: {
		soft: '0 4px 16px 0 rgba(0, 0, 0, 0.15)'
	}
} as const;
