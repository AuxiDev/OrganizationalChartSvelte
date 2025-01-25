<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { HTMLAttributes } from 'svelte/elements';
	import Button from '../Button/Button.svelte';
	import ArrowLeft from '$lib/components/Icons/ArrowLeft/ArrowLeft.svelte';
	import { onMount } from 'svelte';

	let {
		visible = true,
		children,
		...rest
	} = $props<{ visible: boolean; children?: any } & HTMLAttributes<HTMLDivElement>>();

	let sidebarWidth: number = $state(0); // To store the current sidebar width
	let sidebarRef: HTMLDivElement | null = $state(null);

	// Update the sidebar width when it changes
	onMount(() => {
		const updateSidebarWidth = () => {
			if (sidebarRef) {
				sidebarWidth = sidebarRef.offsetWidth;
			}
		};

		// Initialize the width when the component mounts
		updateSidebarWidth();

		window.addEventListener('resize', updateSidebarWidth);

		return () => {
			window.removeEventListener('resize', updateSidebarWidth);
		};
	});
</script>

<div class="sidebar-wrapper">
	<Button
		style=" width: 40px; height: 40px; background-color: #f1f1f1; border-top-right-radius: 0px;border-bottom-right-radius: 0px;"
		variant="ghost"
		onclick={() => (visible = !visible)}
	>
		<ArrowLeft />
	</Button>
	{#if visible}
		<div
			class="sidebar-menu"
			bind:this={sidebarRef}
			transition:slide={{ duration: 300, axis: 'x' }}
			{...rest}
		>
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.sidebar-wrapper {
		display: flex;
		align-items: flex-start;
		height: 100dvh;
		position: relative;
	}

	.sidebar-menu {
		height: 100%;
		width: 250px; /* Default width can be overwritten via style */
		background-color: #f1f1f1;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
	}

	/* Optional: Style the button */
	/* Button styles are included in the button component already */
</style>
