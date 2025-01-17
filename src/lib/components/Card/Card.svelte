<script lang="ts">
	import type { OrgNodeItem } from '$types/types';

	let { data, height, width }: { data: OrgNodeItem; height: number; width: number } = $props();
</script>

<div class="card" style="height: {height}px; width: {width}px;">
	<p>{data.name}</p>
</div>

<style>
	.card {
		width: 60px;
		background-color: white;
		border: 1px solid black;
		text-align: center;
	}
</style>
