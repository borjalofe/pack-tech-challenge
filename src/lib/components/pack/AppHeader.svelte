<script lang="ts">
	import { resolve } from '$app/paths';
	import { PACK_NAV_ITEMS } from './chrome.js';
</script>

<header class="app-header" data-slot="app-header">
	<a class="brand" href={resolve('/')} data-slot="app-header-wordmark">pack</a>

	<nav class="nav" aria-label="Primary" data-slot="app-header-nav">
		{#each PACK_NAV_ITEMS as item (item.label)}
			{#if item.active}
				<a
					href={resolve('/')}
					class="nav-link active"
					aria-current="page"
					data-slot="app-header-nav-link"
					data-active="true"
				>
					{item.label}
				</a>
			{:else}
				<span class="nav-link" data-slot="app-header-nav-link" aria-disabled="true"
					>{item.label}</span
				>
			{/if}
		{/each}
	</nav>

	<div class="actions" data-slot="app-header-actions">
		<span
			class="locale"
			role="img"
			aria-label="Language United States (placeholder)"
			data-slot="app-header-locale"
		>
			🇺🇸
		</span>
		<span class="avatar" role="img" aria-label="Account" data-slot="app-header-avatar">PK</span>
	</div>
</header>

<style>
	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		padding: var(--space-3) var(--space-4);
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
	}

	.brand {
		color: var(--color-foreground);
		font-size: 1.125rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		text-decoration: none;
		text-transform: lowercase;
	}

	.nav {
		display: flex;
		flex: 1;
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		overflow-x: auto;
	}

	.nav-link {
		display: inline-flex;
		align-items: center;
		height: 2.25rem;
		border-bottom: 2px solid transparent;
		color: var(--color-muted);
		font-size: 0.875rem;
		font-weight: 500;
		text-decoration: none;
		white-space: nowrap;
	}

	.nav-link.active {
		color: var(--color-foreground);
		border-bottom-color: var(--color-primary);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.locale,
	.avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
		background: #f3f4f6;
		font-size: 0.875rem;
		font-weight: 600;
	}
</style>
