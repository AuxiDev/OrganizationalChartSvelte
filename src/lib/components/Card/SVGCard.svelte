<!--Got inline styles because else the svg download would be much harder to do-->

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
	style="height: {height}px; width: {width}px; display: flex; justify-content: left; align-items: center; background-color: white; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); text-align: left; border-radius: 10px;"
>
	{#if data.image}
		<img
			class="image"
			src={data.image}
			alt={data.name}
			style="margin-left: 10px; width: 50px; height: 50px; border-radius: 50%;"
		/>
	{/if}
	<div
		class="text-container"
		style="height: {height}px; display: flex; flex-direction: column; justify-content: center; margin-left: 10px;"
	>
		<span class="name-text" style="font-weight: bold; font-size: 16px;">{data.name}</span>
		<span class="description-text" style="font-size: 13px;">{data.description}</span>
	</div>
</div>
