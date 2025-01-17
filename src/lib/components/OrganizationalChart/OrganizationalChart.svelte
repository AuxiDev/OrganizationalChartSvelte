<script lang="ts">
	import Card from '$lib/components/Card/Card.svelte';
	import { type NodeLayout, type OrgNodeItem, NodeStyles } from '$types/types';

	let { data }: { data: OrgNodeItem } = $props();
	let heightBetweenNodes = 30;

	const layout: NodeLayout = [];
	const nodeWidth = 60;
	const nodeHeight = 60;

	const generatePositions = (
		node: OrgNodeItem,
		parentX: number,
		parentY: number,
		childSpacing: number,
		verticalSpacing: number
	): void => {
		layout.push({
			node,
			positionX: parentX,
			positionY: parentY,
			width: nodeWidth,
			height: nodeHeight
		});

		if (node.children.length > 0) {
			const childY = parentY + verticalSpacing + nodeHeight;
			const totalChildWidth = childSpacing * (node.children.length - 1);

			const firstChildX = parentX - totalChildWidth / 2;

			node.children.forEach((child, index) => {
				const childX = firstChildX + index * childSpacing;
				generatePositions(child, childX, childY, childSpacing / 2, verticalSpacing);
			});
		}
	};

	generatePositions(data, 400, 50, 200, heightBetweenNodes);

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
</script>

<svg width="800" height="600">
	{#each layout as parent}
		{#if parent.node.children.length > 0}
			{#each parent.node.children as child}
				{#if layout.find((n: any) => n.node === child)}
					<path
						class="line"
						d={drawTreePath(
							parent.positionX,
							parent.positionY,
							layout.find((n) => n.node === child)?.positionX ?? 0,
							layout.find((n) => n.node === child)?.positionY ?? 0,
							parent.height
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
