<script lang="ts">
	import { PACK_RESOURCE_TABS } from './chrome.js';

	let activeTab = $state<(typeof PACK_RESOURCE_TABS)[number]>('All');
	let query = $state('');
</script>

<div class="toolbar" data-slot="resources-toolbar">
	<div class="tabs-row">
		<span class="chart" aria-hidden="true" title="Chart">
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M4 19V5" />
				<path d="M4 19h16" />
				<path d="M8 17V10" />
				<path d="M12 17V7" />
				<path d="M16 17v-4" />
			</svg>
		</span>
		<div class="tabs" role="tablist" aria-label="Resource type" data-slot="resources-tabs">
			{#each PACK_RESOURCE_TABS as tab (tab)}
				<button
					type="button"
					class="tab"
					class:active={activeTab === tab}
					role="tab"
					aria-selected={activeTab === tab}
					onclick={() => (activeTab = tab)}
				>
					{tab}
				</button>
			{/each}
		</div>
	</div>

	<label class="search" data-slot="search-field">
		<span class="loupe" aria-hidden="true">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.5-3.5" />
			</svg>
		</span>
		<span class="sr-only">Search</span>
		<input type="search" placeholder="Field" bind:value={query} disabled aria-disabled="true" />
	</label>

	<button type="button" class="upload" data-slot="upload-button" disabled aria-disabled="true">
		Upload
	</button>
</div>

<style>
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.tabs-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-width: 0;
	}

	.chart {
		display: inline-flex;
		color: var(--color-muted);
	}

	.tabs {
		display: flex;
		gap: var(--space-2);
		overflow-x: auto;
	}

	.tab {
		appearance: none;
		border: 0;
		border-bottom: 2px solid transparent;
		background: transparent;
		padding: var(--space-2) var(--space-2);
		color: var(--color-muted);
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.tab.active {
		color: var(--color-foreground);
		border-bottom-color: var(--color-info);
	}

	.search {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 12rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		color: var(--color-muted);
	}

	.search input {
		flex: 1;
		border: 0;
		outline: none;
		background: transparent;
		color: var(--color-foreground);
		min-width: 0;
	}

	.search input:disabled {
		cursor: not-allowed;
		opacity: 0.85;
	}

	.upload {
		appearance: none;
		border: 0;
		border-radius: var(--radius-sm);
		background: var(--color-primary);
		color: var(--color-primary-foreground);
		padding: 0.55rem 1rem;
		font-weight: 600;
		cursor: not-allowed;
		opacity: 0.85;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
