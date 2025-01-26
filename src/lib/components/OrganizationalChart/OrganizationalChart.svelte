<script lang="ts">
	import { get, writable } from 'svelte/store';
	import ContextMenu from '../UI/ContextMenu/index';
	import { NodeStyles, type NodeLayout } from '$types/chart';
	import { drawConnectedPath, drawListPath, drawTreePath } from '$lib/utils/drawLinePaths';
	import SvgCard from '../Card/SVGCard.svelte';
	import {
		addNodeBelow,
		ChartStore,
		findParentByIdWithIndex,
		removeNode,
		updateNode
	} from '$lib/stores/ChartStore';
	import { correctNegativePositioning, generatePositions } from '$lib/utils/positionCalculators';
	let svgHeight = $state(800);
	let svgWidth = $state(800);
	let layout = writable<NodeLayout[]>();

	const nodeWidth = 200;
	const nodeHeight = 80;
	const heightBetweenNodes = 30;

	ChartStore.subscribe(() => {
		let generatedNodeLayout = generatePositions(
			get(ChartStore),
			900,
			50,
			nodeWidth,
			nodeHeight,
			heightBetweenNodes
		);

		correctNegativePositioning(generatedNodeLayout, nodeWidth);

		svgWidth = Math.max(...generatedNodeLayout.map((node) => node.positionX)) + nodeWidth;
		svgHeight = Math.max(...generatedNodeLayout.map((node) => node.positionY)) + nodeHeight;

		layout.set(generatedNodeLayout);
	});
</script>

<div>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={svgWidth}
		height={svgHeight}
		style="font-family: sans-serif;"
	>
		<defs>
			<pattern id="dot-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
				<circle cx="10" cy="10" r="1" fill="#ddd" />
			</pattern>
		</defs>

		<rect width="100%" height="100%" fill="url(#dot-pattern)" />

		{#each $layout as parent}
			{#if parent.node.children.length > 0}
				{#each parent.node.children as child}
					{#if get(layout).find((n) => n.node === child)}
						<path
							style="stroke: #666;stroke-width: 2;fill: none;"
							d={parent.node.style === NodeStyles.Connected
								? drawConnectedPath(
										parent.positionX,
										parent.positionY,
										get(layout).find((n) => n.node === child)?.positionX ?? 0,
										get(layout).find((n) => n.node === child)?.positionY ?? 0
									)
								: parent.node.style === NodeStyles.Tree
									? drawTreePath(
											parent.positionX,
											parent.positionY,
											get(layout).find((n) => n.node === child)?.positionX ?? 0,
											get(layout).find((n) => n.node === child)?.positionY ?? 0,
											parent.height
										)
									: drawListPath(
											parent,
											get(layout).find((n) => n.node === child)?.positionX ?? 0,
											get(layout).find((n) => n.node === child)?.positionY ?? 0
										)}
						/>
					{/if}
				{/each}
			{/if}
		{/each}

		{#each $layout as item}
			<foreignObject
				x={item.positionX - item.width / 2}
				y={item.positionY - item.height / 2}
				width={nodeWidth + 5}
				height={nodeHeight + 5}
				role="group"
			>
				<SvgCard data={item.node} height={item.height} width={item.width} layoutItem={item} />
			</foreignObject>
		{/each}
	</svg>
</div>
