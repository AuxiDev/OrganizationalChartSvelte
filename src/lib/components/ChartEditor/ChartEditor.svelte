<script lang="ts">
	import Card from '$lib/components/Card/Card.svelte';
	import { generatePositions } from '$lib/utils/positionCalculators';
	import { drawConnectedPath, drawListPath, drawTreePath } from '$lib/utils/drawLinePaths';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/chart';
	import { onMount } from 'svelte';
	import ContextMenu from '$lib/components/ContextMenu/index';
	import { writable, get } from 'svelte/store';

	export const orgChartStore = writable<OrgNodeItem>({
		name: 'Root',
		style: NodeStyles.Tree,
		children: []
	});
	let heightBetweenNodes = 30;

	onMount(() => {
		setTimeout(() => {
			orgChartStore.update((data) => {
				return {
					...data,
					children: [...data.children, { name: 'Child 1', style: NodeStyles.Tree, children: [] }]
				};
			});
		}, 3000);
	});

	let showContextMenu = $state(false);
	let contextMenuPosition = $state({ x: 0, y: 0 });
	let selectedItem = null;

	function openContextMenu(event: MouseEvent, item: any) {
		event.preventDefault();
		contextMenuPosition = { x: event.clientX, y: event.clientY };
		selectedItem = item;
		showContextMenu = true;
	}

	// svelte-ignore non_reactive_update
	let layout: NodeLayout[] = [];
	const nodeWidth = 100;
	const nodeHeight = 60;

	orgChartStore.subscribe((value) => {
		layout = generatePositions(
			get(orgChartStore),
			500,
			50,
			nodeWidth,
			nodeHeight,
			heightBetweenNodes
		);
	});
</script>

{#if showContextMenu}
	<ContextMenu menuPosition={contextMenuPosition} bind:visible={showContextMenu}>
		<ContextMenu.Item action={() => console.log('Edit node dialog')}>Edit</ContextMenu.Item>
		<ContextMenu.Item action={() => console.log('Add person dialog')}>Add Person</ContextMenu.Item>
	</ContextMenu>
{/if}

<svg width="1400" height="800">
	<defs>
		<pattern id="dot-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
			<circle cx="10" cy="10" r="1" fill="#ddd" />
		</pattern>
	</defs>

	<rect width="100%" height="100%" fill="url(#dot-pattern)" />

	{#each layout as parent}
		{#if parent.node.children.length > 0}
			{#each parent.node.children as child}
				{#if layout.find((n: any) => n.node === child)}
					<path
						class="line"
						d={parent.node.style === NodeStyles.Connected
							? drawConnectedPath(
									parent.positionX,
									parent.positionY,
									layout.find((n) => n.node === child)?.positionX ?? 0,
									layout.find((n) => n.node === child)?.positionY ?? 0,
									parent.height
								)
							: parent.node.style === NodeStyles.Tree
								? drawTreePath(
										parent.positionX,
										parent.positionY,
										layout.find((n) => n.node === child)?.positionX ?? 0,
										layout.find((n) => n.node === child)?.positionY ?? 0,
										parent.height
									)
								: drawListPath(
										parent,
										layout.find((n) => n.node === child)?.positionX ?? 0,
										layout.find((n) => n.node === child)?.positionY ?? 0
									)}
					/>
				{/if}
			{/each}
		{/if}
	{/each}

	{#each layout as item}
		<foreignObject
			x={item.positionX - item.width / 2}
			y={item.positionY - item.height / 2}
			width={nodeWidth + 5}
			height={nodeHeight + 5}
			oncontextmenu={(event) => openContextMenu(event, item)}
			role="group"
		>
			<Card data={item.node} height={item.height} width={item.width} layoutItem={item} />
		</foreignObject>
	{/each}
</svg>

<style>
	svg {
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 10px;
		margin: 20px 20px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
	}

	.line {
		stroke: #666;
		stroke-width: 2;
		fill: none;
	}
</style>
