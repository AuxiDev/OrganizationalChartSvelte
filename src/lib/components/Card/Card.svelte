<script lang="ts">
	import type { NodeLayout, OrgNodeItem } from '$types/chart';

	let {
		data,
		height,
		width,
		layoutItem
	}: { data: OrgNodeItem; height: number; width: number; layoutItem: NodeLayout } = $props();
</script>

<div
	class="card"
	style="height: {height}px; width: {width}px;"
	onclick={() => alert(`X: ${layoutItem.positionX} Y: ${layoutItem.positionY} ID: ${data.id}`)}
>
	<p>{data.name}</p>
</div>

<style>
	.card {
		background-color: white;
		border: 1px solid black;
		text-align: center;
	}
</style>
