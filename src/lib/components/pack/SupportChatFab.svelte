<button
	type="button"
	class="fab"
	aria-label="Open support chat"
	data-slot="support-chat-fab"
	disabled
>
	<svg
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"
	>
		<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.5A8.5 8.5 0 1 1 21 11.5Z" />
	</svg>
	<span class="status" title="Support available" aria-hidden="true"></span>
</button>

<style>
	.fab {
		position: fixed;
		right: var(--space-6);
		bottom: var(--space-6);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3.25rem;
		height: 3.25rem;
		border: 0;
		border-radius: 999px;
		background: var(--color-primary);
		color: var(--color-primary-foreground);
		box-shadow: var(--shadow-soft);
		cursor: not-allowed;
	}

	.status {
		position: absolute;
		right: 0.2rem;
		top: 0.2rem;
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 999px;
		background: var(--color-success);
		border: 2px solid var(--color-surface);
	}
</style>
