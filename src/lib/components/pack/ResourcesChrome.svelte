<script lang="ts">
	import AppHeader from './AppHeader.svelte';
	import ResourcesToolbar from './ResourcesToolbar.svelte';
	import SupportChatFab from './SupportChatFab.svelte';
</script>

<div class="shell" data-slot="dashboard-shell">
	<AppHeader />

	<main class="main">
		<section class="card" data-slot="resources-card">
			<header class="card-head">
				<h1>Resources</h1>
			</header>
			<ResourcesToolbar />
			<div class="body" data-slot="resources-body-placeholder">
				<p>
					Table body lands in a later issue. Chrome (header, card, tabs, Field, Upload, FAB) is
					owned here.
				</p>
			</div>
		</section>
	</main>

	<SupportChatFab />
</div>

<style>
	.shell {
		min-height: 100vh;
		background: var(--color-page);
	}

	.main {
		display: flex;
		justify-content: center;
		padding: var(--space-8) var(--space-4);
	}

	.card {
		width: 100%;
		max-width: var(--width-content);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-soft);
		padding: var(--space-6);
	}

	.card-head {
		margin-bottom: var(--space-4);
	}

	.card-head h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	.body {
		margin-top: var(--space-6);
		padding: var(--space-8) var(--space-4);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-muted);
		text-align: center;
		font-size: 0.925rem;
	}
</style>
