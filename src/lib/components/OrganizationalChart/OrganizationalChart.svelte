<script lang="ts">
	import Card from '$lib/components/Card/Card.svelte';
	import { generatePositions } from '$lib/utils/positionCalculators';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/types';

	let { data }: { data: OrgNodeItem } = $props();
	let heightBetweenNodes = 30;

	// svelte-ignore non_reactive_update
	let layout: NodeLayout[] = [];
	const nodeWidth = 100;
	const nodeHeight = 60;

	layout = generatePositions(data, 500, 50, nodeWidth, nodeHeight, heightBetweenNodes);
	function drawTreePath(
		parentX: number,
		parentY: number,
		childX: number,
		childY: number,
		parentHeight: number
	): string {
		const midX = parentX;
		const midY = parentY + (childY - parentY) / 2;

		return `
      M ${parentX},${parentY + parentHeight / 2}
      L ${midX},${midY}
      L ${childX},${midY}
      L ${childX},${childY - parentHeight / 2}
    `;
	}

	function drawConnectedPath(
		parentX: number,
		parentY: number,
		childX: number,
		childY: number,
		parentHeight: number
	): string {
		const midX = parentX;
		const midY = childY;

		return `
      M ${parentX},${parentY}
      L ${midX},${midY}
      L ${childX},${midY}
      L ${childX},${childY}
    `;
	}

	function drawListPath(parent: NodeLayout, childX: number, childY: number): string {
		const sideX = parent.positionX - parent.width / 2 + 10;
		const sideY = childY;

		return `
      M ${sideX},${parent.positionY}
      L ${sideX},${sideY}
      L ${childX},${sideY}
      L ${childX},${childY}
    `;
	}
</script>

<svg width="1200" height="800">
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
		>
			<Card data={item.node} height={item.height} width={item.width} />
		</foreignObject>
	{/each}
</svg>

<style>
	svg {
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 8px;
		margin: 20px 20px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
	}

	.line {
		stroke: #666;
		stroke-width: 2;
		fill: none;
	}
</style>
