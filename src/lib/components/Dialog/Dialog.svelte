<script lang="ts">
	import { onMount, setContext } from 'svelte';
	let { visible = $bindable(false) }: { visible: boolean } = $props();
</script>
