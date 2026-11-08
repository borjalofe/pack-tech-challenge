<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PublicResourceDto } from '#lib/api/resources.js';
	import AppHeader from './AppHeader.svelte';
	import ResourcesTable from './ResourcesTable.svelte';
	import ResourcesToolbar from './ResourcesToolbar.svelte';
	import SuccessToast from './SuccessToast.svelte';
	import SupportChatFab from './SupportChatFab.svelte';
	import UploadResourceDialog from './UploadResourceDialog.svelte';

	type Props = {
		initialItems?: PublicResourceDto[];
	};

	let { initialItems = [] }: Props = $props();

	let uploadOpen = $state(false);
	let toastOpen = $state(false);
	let toastTimer: ReturnType<typeof setTimeout> | undefined;

	async function onUploaded() {
		await invalidateAll();
		toastOpen = true;
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toastOpen = false;
		}, 3500);
	}
</script>

<div class="shell" data-slot="dashboard-shell">
	<AppHeader />

	<main class="main">
		<section class="card" data-slot="resources-card">
			<header class="card-head">
				<h1>Resources</h1>
			</header>
			<div class="card-body">
				<SuccessToast open={toastOpen} />
				<ResourcesToolbar onUploadClick={() => (uploadOpen = true)} />
				<ResourcesTable items={initialItems} />
			</div>
		</section>
	</main>

	<SupportChatFab />
	<UploadResourceDialog bind:open={uploadOpen} {onUploaded} />
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
		position: relative;
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

	.card-body {
		position: relative;
	}
</style>
