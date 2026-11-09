<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PublicResourceDto } from '#lib/api/resources.js';
	import { RESOURCE_CATEGORY_LABELS, RESOURCE_PROVIDER_LABELS } from '#lib/catalog.js';

	type Props = {
		items?: PublicResourceDto[];
	};

	let { items = [] }: Props = $props();

	type SortDir = 'asc' | 'desc';
	let sortDir = $state<SortDir>('asc');

	const sorted = $derived(
		[...items].sort((a, b) => {
			const cmp = a.title.localeCompare(b.title);
			return sortDir === 'asc' ? cmp : -cmp;
		})
	);

	function toggleSort() {
		sortDir = sortDir === 'asc' ? 'desc' : 'asc';
	}

	function providerLabel(value: string) {
		return RESOURCE_PROVIDER_LABELS[value as keyof typeof RESOURCE_PROVIDER_LABELS] ?? value;
	}

	function typeLabel(value: string) {
		return RESOURCE_CATEGORY_LABELS[value as keyof typeof RESOURCE_CATEGORY_LABELS] ?? value;
	}

	function fileHref(id: string) {
		return resolve('/api/resources/[id]/file', { id });
	}

	/** Row activation downloads/opens the stored file (Image 3 + #22/#54). */
	function openResource(id: string) {
		const anchor = document.createElement('a');
		anchor.href = fileHref(id);
		anchor.rel = 'noopener';
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
	}

	function onRowKeydown(event: KeyboardEvent, id: string) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openResource(id);
		}
	}
</script>

<div class="wrap" data-slot="resources-table">
	<table>
		<thead>
			<tr>
				<th scope="col">
					<button
						type="button"
						class="sort"
						data-slot="resources-table-title-sort"
						aria-label={`Sort by content title ${sortDir === 'asc' ? 'descending' : 'ascending'}`}
						onclick={toggleSort}
					>
						Content Title
						<span class="sort-icon" aria-hidden="true">{sortDir === 'asc' ? '▾' : '▴'}</span>
					</button>
				</th>
				<th scope="col">Path</th>
				<th scope="col">View Count</th>
				<th scope="col">Uploaded By</th>
				<th scope="col">Provider</th>
				<th scope="col">Type</th>
				<th scope="col"><span class="sr-only">Actions</span></th>
			</tr>
		</thead>
		<tbody>
			{#if sorted.length === 0}
				<tr>
					<td class="empty" colspan="7">No resources yet. Use Upload to add one.</td>
				</tr>
			{:else}
				{#each sorted as row (row.id)}
					<tr
						class="row"
						data-slot="resources-table-row"
						tabindex="0"
						aria-label={`Download ${row.title}`}
						onclick={() => openResource(row.id)}
						onkeydown={(event) => onRowKeydown(event, row.id)}
					>
						<td>
							<span class="title">{row.title}</span>
						</td>
						<td class="muted">{row.fileOriginalName}</td>
						<td>{row.viewCount}</td>
						<td class="muted">{row.uploadedBy ?? '—'}</td>
						<td>
							<span class="pill" data-slot="resources-table-provider-pill"
								>{providerLabel(row.provider)}</span
							>
						</td>
						<td>
							<span class="pill" data-slot="resources-table-type-pill"
								>{typeLabel(row.category)}</span
							>
						</td>
						<td class="actions">
							<button
								type="button"
								class="more"
								data-slot="resources-table-row-actions"
								aria-label={`Row actions for ${row.title}`}
								title="Actions"
								onclick={(event) => event.stopPropagation()}
							>
								⋮
							</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<style>
	.wrap {
		margin-top: var(--space-6);
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	th,
	td {
		padding: 0.85rem 0.75rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border);
		vertical-align: middle;
	}

	th {
		color: var(--color-muted);
		font-weight: 500;
		white-space: nowrap;
	}

	.row {
		cursor: pointer;
	}

	.row:hover {
		background: color-mix(in srgb, var(--color-page) 80%, transparent);
	}

	.row:focus-visible {
		outline: 2px solid var(--color-info);
		outline-offset: -2px;
	}

	.muted {
		color: var(--color-muted);
	}

	.empty {
		text-align: center;
		color: var(--color-muted);
		padding: var(--space-8) var(--space-4);
	}

	.sort {
		appearance: none;
		border: 0;
		background: transparent;
		padding: 0;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: inherit;
		font: inherit;
		cursor: pointer;
	}

	.sort-icon {
		font-size: 0.75rem;
	}

	.title {
		font-weight: 500;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		border: 1px solid var(--color-border);
		background: var(--color-page);
		color: var(--color-foreground);
		font-size: 0.75rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.actions {
		text-align: right;
		width: 2.5rem;
	}

	.more {
		appearance: none;
		border: 0;
		background: transparent;
		color: var(--color-muted);
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
	}

	.more:hover {
		color: var(--color-foreground);
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
