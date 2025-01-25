<!--Got inline styles because else the svg download would be much harder to do-->

<script lang="ts">
	import type { ChartNode, NodeLayout } from '$types/chart';

	let {
		data,
		height,
		width
	}: { data: ChartNode; height: number; width: number; layoutItem: NodeLayout } = $props();
</script>

<div
	class="card"
	style="height: {height}px; width: {width}px; display: flex; justify-content: left; align-items: center; background-color: white; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); text-align: left; border-radius: 10px;"
>
	{#if data.person.image}
		<img
			class="image"
			src={data.person.image}
			alt={data.person.name}
			style="margin-left: 10px; width: 50px; height: 50px; border-radius: 50%;"
		/>
	{/if}
	<div
		class="text-container"
		style="height: {height}px; display: flex; flex-direction: column; justify-content: center; margin-left: 10px;"
	>
		<span class="name-text" style="font-weight: bold; font-size: 16px;">{data.person.name}</span>
		<span class="description-text" style="font-size: 13px;">{data.person.description}</span>
	</div>
</div>
