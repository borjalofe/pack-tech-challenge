import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PACK_TOKENS } from './tokens.js';

const tokensCssPath = join(dirname(fileURLToPath(import.meta.url)), 'tokens.css');

describe('Pack visual tokens (#19)', () => {
	it('exports the audited Pack primary and chrome anchors', () => {
		expect(PACK_TOKENS.color.primary).toBe('#FC8034');
		expect(PACK_TOKENS.color.page).toBe('#F9FAFC');
		expect(PACK_TOKENS.color.surface).toBe('#FFFFFF');
		expect(PACK_TOKENS.color.success).toBe('#1C9C70');
		expect(PACK_TOKENS.color.muted).toBe('#5C5C5C');
		expect(PACK_TOKENS.radius.md).toBe('8px');
		expect(PACK_TOKENS.width.content).toBe('1120px');
	});

	it('wires those anchors into CSS custom properties', () => {
		const css = readFileSync(tokensCssPath, 'utf8');
		const normalized = css.toLowerCase();
		expect(normalized).toContain('--color-primary: #fc8034');
		expect(normalized).toContain('--color-page: #f9fafc');
		expect(normalized).toContain('--color-surface: #ffffff');
		expect(normalized).toContain('--color-success: #1c9c70');
		expect(css).toContain('--shadow-soft:');
		expect(css).toContain('--font-sans:');
	});
});
