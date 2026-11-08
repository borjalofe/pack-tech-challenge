<script lang="ts">
	import ResourcesChrome from '#lib/components/pack/ResourcesChrome.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<ResourcesChrome initialItems={data.items} />
