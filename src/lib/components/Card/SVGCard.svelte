<!--Got inline styles because else the svg download would be much harder to do-->

<script lang="ts">
	import { updateNode } from '$lib/stores/ChartStore';
	import { addActionToHistory } from '$lib/stores/HistoryStore';
	import { findPerson } from '$lib/stores/PersonStore';
	import type { ChartNode, NodeLayout } from '$types/chart';
	import Replace from '../Icons/Replace/Replace.svelte';

	let {
		data,
		height,
		width
	}: { data: ChartNode; height: number; width: number; layoutItem: NodeLayout } = $props();

	let isDragOver = $state(false);

	const handleDrop = (event: DragEvent) => {
		const personID = event.dataTransfer?.getData('personID');
		let person = findPerson(personID ?? '');
		let dataOld: ChartNode = JSON.parse(JSON.stringify(data));
		updateNode(data.id, data.style, person);

		addActionToHistory({
			type: 'editNode',
			dataOld: dataOld,
			dataNew: JSON.parse(JSON.stringify(data))
		});

		isDragOver = false;
	};

	const handleDragLeave = (event: any) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node)) {
			isDragOver = false;
		}
	};
</script>

<div
	role="region"
	ondragover={(e) => e.preventDefault()}
	ondragenter={() => (isDragOver = true)}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	class="card"
	style="height: {height}px; width: {width}px; display: flex; justify-content: left; align-items: center; background-color: white; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); text-align: left; border-radius: 10px;"
>
	{#if isDragOver}
		<div
			style=" position: absolute;
				background-color: rgba(0, 0, 0, 0.05);
		border: 2px dashed rgba(0, 0, 0, 0.2);
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(2px);
		background-color: rgba(0, 0, 0, 0.1); "
		>
			<div style="width: 30px; height: 30px">
				<Replace />
			</div>
		</div>
	{/if}
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
