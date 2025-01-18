<script lang="ts">
	import type { NodeLayout, OrgNodeItem } from '$types/chart';

	let {
		data,
		height,
		width,
		layoutItem
	}: { data: OrgNodeItem; height: number; width: number; layoutItem: NodeLayout } = $props();
</script>

<div class="card" style="height: {height}px; width: {width}px;">
	{#if data.image}
		<img class="image" src={data.image} alt={data.name} />
	{/if}
	<div class="text-container" style="height: {height}px;">
		<span class="name-text">{data.name}</span>
		<span class="description-text">{data.description}</span>
	</div>
</div>

<style>
	.card {
		display: flex;
		justify-content: left;
		align-items: center;
		background-color: white;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		text-align: left;
		border-radius: 10px;
	}

	.text-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 10px;
	}

	.name-text {
		font-weight: bold;
		font-size: 16px;
	}

	.description-text {
		font-size: 13px;
	}

	.image {
		margin-left: 10px;
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
</style>
