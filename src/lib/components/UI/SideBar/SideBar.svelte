<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { HTMLAttributes } from 'svelte/elements';
	import Button from '../Button/Button.svelte';
	import ArrowLeft from '$lib/components/Icons/ArrowLeft/ArrowLeft.svelte';

	let {
		visible = true,
		children,
		...rest
	} = $props<{ visible: boolean; children?: any } & HTMLAttributes<HTMLDivElement>>();
</script>

<div class="sidebar-container">
	<Button
		style="width: 40px; height: 40px; background-color: #f1f1f1"
		variant="ghost"
		onclick={() => (visible = !visible)}
	>
		<ArrowLeft />
	</Button>
	{#if visible}
		<div class="sidebar-menu" transition:slide={{ duration: 300, axis: 'x' }} {...rest}>
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.sidebar-container {
		display: flex;
		align-items: flex-start;
		height: 100dvh;
	}
	.sidebar-menu {
		height: 100%;
		width: 250px;
		background-color: #f1f1f1;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
	}
</style>
