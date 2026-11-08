<script lang="ts">
	import { RESOURCE_UPLOADED_TOAST } from './resources-table.js';

	type Props = {
		open?: boolean;
	};

	let { open = false }: Props = $props();
</script>

{#if open}
	<div class="toast" role="status" aria-live="polite" data-slot="resources-success-toast">
		<span class="check" aria-hidden="true">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="10" fill="currentColor" />
				<path
					d="M8 12.5 10.5 15 16 9.5"
					stroke="#fff"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
		<span>{RESOURCE_UPLOADED_TOAST}</span>
	</div>
{/if}

<style>
	.toast {
		position: absolute;
		top: var(--space-4);
		left: 50%;
		transform: translateX(-50%);
		z-index: 5;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: 0.55rem 0.9rem;
		border-radius: 999px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-soft);
		color: var(--color-foreground);
		font-size: 0.875rem;
		font-weight: 500;
		white-space: nowrap;
	}

	.check {
		display: inline-flex;
		color: var(--color-success);
	}
</style>
