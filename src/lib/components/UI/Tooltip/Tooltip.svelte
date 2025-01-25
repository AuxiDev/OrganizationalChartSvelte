<script lang="ts">
	import { onMount } from 'svelte';

	let { text, children, ...rest } = $props<{
		text: string;
		children?: any;
	}>();

	let tooltip: HTMLDivElement | null = null;
	let container: HTMLDivElement | null = null;
	let position: 'top' | 'bottom' | 'left' | 'right' = $state('top');

	onMount(() => {
		if (tooltip && container) {
			const containerRect = container.getBoundingClientRect();
			const tooltipRect = tooltip.getBoundingClientRect();
			const spaceAbove = containerRect.top;
			const spaceBelow = window.innerHeight - containerRect.bottom;
			const spaceLeft = containerRect.left;
			const spaceRight = window.innerWidth - containerRect.right;
			if (spaceRight >= tooltipRect.width + 30) {
				position = 'right';
			} else if (spaceBelow >= tooltipRect.height + 30) {
				position = 'bottom';
			} else if (spaceAbove >= tooltipRect.height + 30) {
				position = 'top';
			} else if (spaceLeft >= tooltipRect.width + 30) {
				position = 'left';
			} else {
				position = 'bottom';
			}
		}
	});
</script>

<div class="tooltip-container" bind:this={container}>
	<div class="tooltip-content" bind:this={tooltip} data-position={position}>
		<p>{text}</p>
	</div>
	{@render children?.()}
</div>

<style>
	.tooltip-container {
		position: relative;
		cursor: pointer;
		display: inline-block;
	}

	.tooltip-content {
		position: absolute;
		background-color: white;
		padding: 6px 10px;
		border-radius: 4px;
		font-size: 12px;
		border: 1px solid #f1f1f1;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.2s ease-in-out;
		white-space: nowrap;
		z-index: 1000;
	}

	.tooltip-container:hover .tooltip-content {
		opacity: 1;
	}

	.tooltip-content[data-position='top'] {
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-bottom: 8px;
	}

	.tooltip-content[data-position='bottom'] {
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		margin-top: 8px;
	}

	.tooltip-content[data-position='left'] {
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		margin-right: 8px;
	}

	.tooltip-content[data-position='right'] {
		left: 100%;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 8px;
	}

	.tooltip-container p {
		margin: 0;
		font-size: 14px;
		color: black;
	}
</style>
